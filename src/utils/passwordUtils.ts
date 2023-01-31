import * as bcrypt from 'bcrypt'
import { accessEnv } from '@payhasly-discount/common'

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, parseInt(accessEnv('SALT_ROUNDS')))
}

export const comparePasswords = async (password: string, hashed: string) => {
    return await bcrypt.compare(password, hashed)
}
