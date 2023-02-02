import { bodyValidator, controller, get, del, put, use } from './decorators'
import { Request, Response } from 'express'
import { User } from '../models'
import { UserUpdateDto } from '../models/dto'
import { authHandler, Tokens, sendMessage } from '@payhasly-discount/common'

@controller('')
class MeController {
    @use([authHandler(Tokens.accessToken, 'JWT_ACCESS')])
    @get('me')
    async getMe(req: Request, res: Response) {
        const { id } = req.payload

        const user = await User.findById(id)
        if (!user)
            return res.status(404).send({
                errors: `User with id number ${id} is no longer available`
            })

        return res.status(200).json(user)
    }

    @use([authHandler(Tokens.accessToken, 'JWT_ACCESS')])
    @put('me')
    @bodyValidator(UserUpdateDto)
    async udpateMe(req: Request, res: Response) {
        const { id } = req.payload

        const user = await User.findById(id)
        if (!user)
            return res.status(404).send({
                errors: `User with id number ${id} is no longer available`
            })

        await sendMessage(
            'AMQP_URL',
            JSON.stringify({ id, ...req.body }),
            'updateUser'
        )

        await user.updateOne(req.body)

        return res.status(200).json({ id: user._id, ...req.body })
    }

    @use([authHandler(Tokens.accessToken, 'JWT_ACCESS')])
    @del('me')
    async deleteMe(req: Request, res: Response) {
        const { id } = req.payload

        const user = await User.findByIdAndDelete(id)
        if (!user)
            return res.status(404).send({
                errors: `User with id number ${id} is no longer available`
            })

        return res.status(204).end()
    }
}
