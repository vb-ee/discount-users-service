import { bodyValidator, controller, post, get, del, use } from './decorators'
import { Request, Response } from 'express'
import { User, RefreshToken } from '../models'
import { UserCreateDto } from '../models/dto'
import { comparePasswords, IJwtPayload, JwtUtils } from '../utils'
import { verifyToken } from '../middleware'

@controller('')
class AuthController {
    @post('signup')
    @bodyValidator(UserCreateDto)
    async signup(req: Request, res: Response) {
        const { password, phone, isAdmin } = req.body

        const user = await User.findOne({ phone })
        if (user)
            return res
                .status(400)
                .send({ errors: `User with phone '${phone}' already exists` })

        const newUser = await User.create({ password, phone, isAdmin })

        const { accessToken, refreshToken } =
            newUser.assignTokensToUserAndReturnThem()

        await RefreshToken.create({ userId: newUser._id, token: refreshToken })

        const userToSend = {
            _id: newUser._id,
            phone: newUser.phone,
            isAdmin: newUser.isAdmin
        }

        return res
            .status(201)
            .send({ user: userToSend, accessToken, refreshToken })
    }

    @post('login')
    async login(req: Request, res: Response) {
        const { phone, password } = req.body

        const user = await User.findOne({ phone })
        if (!user || !(await comparePasswords(password, user.password)))
            return res.status(401).send({ errors: `Invalid Credentials` })

        const jwtPayload: IJwtPayload = {
            id: user._id,
            phone,
            isAdmin: user.isAdmin
        }
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

        const userToSend = {
            _id: user._id,
            phone: user.phone,
            isAdmin: user.isAdmin
        }

        return res
            .status(200)
            .send({ user: userToSend, accessToken, refreshToken })
    }

    @get('token')
    @use([verifyToken(true)])
    async token(req: Request, res: Response) {
        const { phone, isAdmin } = req.payload

        const user = await User.findOne({ phone }, { password: 0 })
        if (!user)
            return res.status(404).send({
                errors: `User with phone number ${phone} is no longer available`
            })

        const refreshToken = await user.getRefreshToken()

        if (!refreshToken || !refreshToken.token)
            return res.status(401).send({ errors: 'Unauthorized' })

        const accessToken = JwtUtils.generateAccessToken({
            id: user._id,
            phone,
            isAdmin
        })

        res.status(200).send({ user, accessToken })
    }

    @del('logout')
    @use([verifyToken()])
    async logout(req: Request, res: Response) {
        const { phone } = req.payload

        const user = await User.findOne({ phone })

        if (!user)
            return res.status(404).send({
                errors: `User with phone number ${phone} is no longer available`
            })

        const refreshToken = await user.getRefreshToken()

        if (refreshToken) {
            refreshToken.token = null
            await refreshToken.save()
        }

        return res.status(200).send({ msg: 'Successfully logged out' })
    }
}
