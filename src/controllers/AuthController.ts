import { bodyValidator, controller, post } from './decorators'
import { Request, Response, NextFunction } from 'express'
import { User } from '../models/User'
import { IJwtPayload, JwtUtils } from '../utils'
import { RefreshToken } from '../models/RefreshToken'
import { UserCreateDto } from '../models/dto'

@controller('/')
class AuthController {
    @post('signup')
    @bodyValidator(UserCreateDto)
    async signup(req: Request, res: Response) {
        const { email, password, phone } = req.body

        const user = await User.findOne({ email }).exec()
        if (user)
            return res
                .status(400)
                .send({ msg: `User with email '${email}' already exists` })

        const newUser = await User.create({ email, password, phone })

        const jwtPayload: IJwtPayload = {
            id: newUser._id,
            email,
            isAdmin: newUser.isAdmin
        }

        const accessToken = JwtUtils.generateAccessToken(jwtPayload)
        const refreshToken = JwtUtils.generateAccessToken(jwtPayload)

        await RefreshToken.create({ userId: newUser._id, token: refreshToken })

        res.status(201).send({ user: newUser, accessToken, refreshToken })
    }

    @post('login')
    async login(req: Request, res: Response, next: NextFunction) {}
    @post('token')
    async token(req: Request, res: Response, next: NextFunction) {}
    @post('logout')
    async logout(req: Request, res: Response, next: NextFunction) {}
}
