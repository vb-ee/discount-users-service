import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'
import { accessEnv } from './accessEnvs'

export interface IJwtPayload {
    id: Types.ObjectId
    email: string
    isAdmin: boolean
}

export class JwtUtils {
    private static accessSecret = accessEnv('JWT_ACCESS')
    private static refreshSecret = accessEnv('JWT_REFRESH')

    static generateAccessToken(payload: IJwtPayload): string {
        return jwt.sign(payload, this.accessSecret, {
            expiresIn: accessEnv('ACCESS_EXPIRE')
        })
    }

    static generateRefreshToken(payload: IJwtPayload) {
        return jwt.sign(payload, this.refreshSecret)
    }

    static verifyAccessToken(accessToken: string) {
        return jwt.verify(accessToken, this.accessSecret)
    }

    static verifyRefreshToken(refreshToken: string) {
        return jwt.verify(refreshToken, this.refreshSecret)
    }
}
