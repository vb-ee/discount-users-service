import { Schema, model } from 'mongoose'
import { hashPassword } from '../utils'

// Create an interface representing a document in MongoDB.
export interface IUser {
    email: string
    phone: string
    password: string
    isAdmin: boolean
}

// Create a Schema corresponding to the document interface.
export const userSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true, unique: true },
        password: { type: String, required: true, minlength: 6 },
        isAdmin: { type: Boolean, default: false }
    },
    { timestamps: true }
)

userSchema.pre<IUser>('save', async function (next) {
    this.password = await hashPassword(this.password)
})

// Create a Model.
export const User = model<IUser>('User', userSchema)
