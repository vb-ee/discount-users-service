import { Schema, model, Model, Document, Types } from 'mongoose'
import { hashPassword, JwtUtils } from '../utils'
import { IRefreshToken, RefreshToken } from './RefreshToken'
import { IJwtPayload, sendMessage } from '@payhasly-discount/common'
// Create an interface representing a document in MongoDB.
export interface IUser {
    phone: string
    password: string
    isAdmin: boolean
}

// Put all user instance methods in this interface
export interface IUserMethods {
    assignTokensToUserAndReturnThem(): { [key: string]: string }
    getRefreshToken(): Promise<
        | (Document<unknown, any, IRefreshToken> &
              IRefreshToken & {
                  _id: Types.ObjectId
              })
        | null
    >
}

// Create a new Model type that knows about IUserMethods...
type UserModel = Model<IUser, {}, IUserMethods>

// Create a Schema corresponding to the document interfaces.
export const userSchema = new Schema<IUser, UserModel, IUserMethods>(
    {
        phone: {
            type: String,
            required: true,
            unique: true,
            minlength: 8,
            maxlength: 8,
            validate: {
                validator: function (value: string) {
                    return /^[6]/i.test(value)
                },
                message: (props) =>
                    `${props.value} is not a valid phone number!`
            }
        },
        password: { type: String, required: true, minlength: 6 },
        isAdmin: { type: Boolean, default: false }
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id
                delete ret._id
                delete ret.password
                delete ret.__v
            }
        }
    }
)

// Instance Methods
userSchema.methods.assignTokensToUserAndReturnThem = function () {
    const jwtPayload: IJwtPayload = {
        id: this._id,
        phone: this.phone,
        isAdmin: this.isAdmin
    }

    const accessToken = JwtUtils.generateAccessToken(jwtPayload)
    const refreshToken = JwtUtils.generateRefreshToken(jwtPayload)

    return { accessToken, refreshToken }
}

userSchema.methods.getRefreshToken = async function () {
    return await RefreshToken.findOne({ userId: this._id })
}

// Middlewares
userSchema.pre('save', async function (next) {
    this.password = await hashPassword(this.password)
    next()
})

userSchema.post('save', async function (doc, next) {
    const userToSend = {
        id: doc._id,
        phone: doc.phone,
        isAdmin: doc.isAdmin
    }
    await sendMessage('AMQP_URL', JSON.stringify(userToSend), 'createUser')
    next()
})

userSchema.post('updateOne', async function (doc, next) {
    const userToSend = {
        id: doc._id,
        phone: doc.phone,
        isAdmin: doc.isAdmin
    }
    console.log(userToSend)
    await sendMessage('AMQP_URL', JSON.stringify(userToSend), 'updateUser')
    next()
})

userSchema.post('findOneAndDelete', async function (doc, next) {
    await sendMessage('AMQP_URL', doc._id, 'deleteUser')
    next()
})

// Create a Model.
export const User = model<IUser, UserModel>('User', userSchema)
