import { Schema, model, Types } from 'mongoose'

// Create an interface representing a document in MongoDB.
export interface IRefreshToken {
    userId: Types.ObjectId
    token: string
}

// Create a Schema corresponding to the document interface.
export const refreshTokenSchema = new Schema<IRefreshToken>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        token: String,
    },
    { timestamps: true }
)

// Create a Model.
export const RefreshToken = model<IRefreshToken>('User', refreshTokenSchema)
