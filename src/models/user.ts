import { Schema, model } from 'mongoose'
import { idText } from 'typescript'
import { hashPassword, IJwtPayload, JwtUtils } from '../utils'

// Create an interface representing a document in MongoDB.
export interface IUser {
    email: string
    phone: string
    password: string
    isAdmin: boolean
    assignTokensToUserAndReturnThem(): { [key: string]: string }
}

// Create a Schema corresponding to the document interface.
export const userSchema = new Schema<IUser>(
    {
        email: { type: String, unique: true, required: true },
        phone: { type: String, required: true, unique: true },
        password: { type: String, required: true, minlength: 6 },
        isAdmin: { type: Boolean, default: false }
    },
    { timestamps: true }
)

userSchema.methods.assignTokensToUserAndReturnThem = function () {
    const jwtPayload: IJwtPayload = {
        id: this._id,
        phone: this.phone,
        isAdmin: this.isAdmin
    }

    const accessToken = JwtUtils.generateAccessToken(jwtPayload)
    const refreshToken = JwtUtils.generateAccessToken(jwtPayload)

    return { accessToken, refreshToken }
}

userSchema.pre<IUser>('save', async function () {
    this.password = await hashPassword(this.password)
})

// Create a Model.
export const User = model<IUser>('User', userSchema)
