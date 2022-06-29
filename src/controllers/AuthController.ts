import { bodyValidator, controller, post } from './decorators'
import { Request, Response, NextFunction } from 'express'
import { User } from '../models/User'
import { RefreshToken } from '../models/RefreshToken'
import { UserCreateDto } from '../models/dto'

@controller('/')
class AuthController {
    @post('signup')
    @bodyValidator(UserCreateDto)
    async signup(req: Request, res: Response) {
        const { email, password, phone, isAdmin } = req.body

        const user = await User.findOne({ phone })
        if (user)
            return res
                .status(400)
                .send({ msg: `User with email '${phone}' already exists` })

        const newUser = await User.create({ email, password, phone, isAdmin })

        const { accessToken, refreshToken } =
            newUser.assignTokensToUserAndReturnThem()

        await RefreshToken.create({ userId: newUser._id, token: refreshToken })

        const userToSend = newUser.toJSON()

        delete userToSend['password']

        res.status(201).send({ user: userToSend, accessToken, refreshToken })
    }

    @post('login')
    async login(req: Request, res: Response, next: NextFunction) {}
    @post('token')
    async token(req: Request, res: Response, next: NextFunction) {}
    @post('logout')
    async logout(req: Request, res: Response, next: NextFunction) {}
}
