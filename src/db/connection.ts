import { connect } from 'mongoose'

export const initConnection = async (mongoDbUri: string) => {
    await connect(mongoDbUri)
}
