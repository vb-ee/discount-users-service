import { bodyValidator, controller, get, del, put, use } from './decorators'
import { Request, Response } from 'express'
import { User } from '../models'
import { UserUpdateDto } from '../models/dto'
import { authHandler, Tokens } from '@payhasly-discount/common'

@controller('')
class MeController {
    @use([authHandler(Tokens.accessToken, 'JWT_ACCESS')])
    @get('me')
    async getMe(req: Request, res: Response) {
        const { phone } = req.payload

        const user = await User.findOne({ phone })
        if (!user)
            return res.status(404).send({
                errors: `User with phone number ${phone} is no longer available`
            })

        return res.status(200).json(user)
    }

    @use([authHandler(Tokens.accessToken, 'JWT_ACCESS')])
    @put('me')
    @bodyValidator(UserUpdateDto)
    async udpateMe(req: Request, res: Response) {
        const { phone } = req.payload

        const user = await User.findOneAndUpdate({ phone }, req.body)
        if (!user)
            return res.status(404).send({
                errors: `User with phone number ${phone} is no longer available`
            })

        return res.status(200).json(user)
    }

    @use([authHandler(Tokens.accessToken, 'JWT_ACCESS')])
    @del('me')
    async deleteMe(req: Request, res: Response) {
        const { phone } = req.payload

        const user = await User.findOneAndDelete({ phone })
        if (!user)
            return res.status(404).send({
                errors: `User with phone number ${phone} is no longer available`
            })

        return res.status(204).end()
    }
}
