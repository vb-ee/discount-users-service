import { Schema, model, Types } from 'mongoose'

// Create an interface representing a document in MongoDB.
export interface IUser {
    userId: Types.ObjectId
    email: string
    phone: string
    password: string
    isAdmin?: boolean
}

// Create a Schema corresponding to the document interface.
export const userSchema = new Schema<IUser>(
    {
        userId: Schema.Types.ObjectId,
        email: { type: String, required: true },
        phone: { type: String, required: true },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, default: false },
    },
    { timestamps: true }
)

// Create a Model.
export const User = model<IUser>('User', userSchema)
