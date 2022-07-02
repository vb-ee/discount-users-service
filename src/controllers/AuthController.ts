import { bodyValidator, controller, post } from './decorators'
import { Request, Response, NextFunction } from 'express'
import { User } from '../models/User'
import { RefreshToken } from '../models/RefreshToken'
import { UserCreateDto } from '../models/dto'
import { comparePasswords, IJwtPayload, JwtUtils } from '../utils'

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

        return res.status(201).send({ accessToken, refreshToken })
    }

    @post('login')
    async login(req: Request, res: Response) {
        const { phone, password, isAdmin } = req.body

        const user = await User.findOne({ phone })
        if (!user || !comparePasswords(password, user.password))
            return res.status(401).send({ msg: `Invalid Credentials` })

        const jwtPayload: IJwtPayload = { id: user._id, phone, isAdmin }
        const accessToken = JwtUtils.generateAccessToken(jwtPayload)
        const savedRefreshToken = await user.getRefreshToken()

        let refreshToken: string

        if (!savedRefreshToken || !savedRefreshToken.token) {
            refreshToken = JwtUtils.generateRefreshToken(jwtPayload)

            if (!savedRefreshToken) {
                await RefreshToken.create({
                    userId: user._id,
                    token: refreshToken
                })
            } else {
                savedRefreshToken.token = refreshToken
                await savedRefreshToken.save()
            }
        } else {
            refreshToken = savedRefreshToken.token
        }

        return res.status(200).send({ accessToken, refreshToken })
    }
    @post('token')
    async token(req: Request, res: Response) {
        const { phone, isAdmin } = req.payload

        const user = await User.findOne({ phone })

        if (!user)
            return res.status(404).send({
                msg: `User with phone number ${phone} is no longer available`
            })

        const refreshToken = await user.getRefreshToken()

        if (!refreshToken || !refreshToken.token)
            return res.status(401).send({ msg: 'Unauthorized' })

        const accessToken = JwtUtils.generateAccessToken({
            id: user._id,
            phone,
            isAdmin
        })

        res.status(200).send({ accessToken })
    }
    @post('logout')
    async logout(req: Request, res: Response, next: NextFunction) {
        const { phone } = req.payload

        const user = await User.findOne({ phone })

        if (!user)
            return res.status(404).send({
                msg: `User with phone number ${phone} is no longer available`
            })

        const refreshToken = await user.getRefreshToken()

        if (refreshToken) {
            refreshToken.token = null
            await refreshToken.save()
        }

        return res.status(200).send({ msg: 'Successfully logged out' })
    }
}
