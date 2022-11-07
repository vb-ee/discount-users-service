import { Schema, model, Model, Document, Types } from 'mongoose'
import { accessEnv, hashPassword, IJwtPayload, JwtUtils } from '../utils'
import { IRefreshToken, RefreshToken } from './RefreshToken'
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
    { timestamps: true }
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
userSchema.pre<IUser>('save', async function (next) {
    this.password = await hashPassword(this.password)
    next()
})

// Create a Model.
export const User = model<IUser, UserModel>('User', userSchema)
