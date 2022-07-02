import { Schema, model, Types } from 'mongoose'

// Create an interface representing a document in MongoDB.
export interface IRefreshToken {
    userId: Types.ObjectId
    token: string | null
}

// Create a Schema corresponding to the document interface.
export const refreshTokenSchema = new Schema<IRefreshToken>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        token: String
    },
    { timestamps: { createdAt: true, updatedAt: false } }
)

// Create a Model.
export const RefreshToken = model<IRefreshToken>(
    'RefreshToken',
    refreshTokenSchema
)
