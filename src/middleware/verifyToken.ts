import { Request, Response, NextFunction } from 'express'
import { IJwtPayload, JwtUtils } from '../utils'

export const verifyToken = (isRefresh: boolean = false) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization
        let jwtPayload: IJwtPayload
        if (authHeader) {
            const token = authHeader.split(' ')[1]
            if (isRefresh) jwtPayload = JwtUtils.verifyRefreshToken(token)
            else jwtPayload = JwtUtils.verifyAccessToken(token)
        } else {
            return res
                .status(401)
                .send({ errors: 'Authorization header not found' })
        }
        req.payload = jwtPayload
        next()
    }
}