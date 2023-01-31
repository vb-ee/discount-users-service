import * as jwt from 'jsonwebtoken'
import { accessEnv, IJwtPayload } from '@payhasly-discount/common'

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
}
