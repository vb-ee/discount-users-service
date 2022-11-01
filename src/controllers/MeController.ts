import { bodyValidator, controller, get, del, put, use } from './decorators'
import { Request, Response } from 'express'
import { User } from '../models'
import { UserUpdateDto } from '../models/dto'
import { verifyToken } from '../middleware'

@controller('')
class MeController {
    @use([verifyToken()])
    @get('me')
    async getMe(req: Request, res: Response) {
        const { phone } = req.payload

        const user = await User.findOne({ phone }, { password: 0 })
        if (!user)
            return res.status(404).send({
                errors: `User with phone number ${phone} is no longer available`
            })

        return res.status(200).json(user)
    }

    @use([verifyToken()])
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

    @use([verifyToken()])
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
