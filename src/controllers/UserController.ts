import {
    get,
    controller,
    post,
    bodyValidator,
    put,
    del,
    paramsValidator,
    use
} from './decorators'
import { Request, Response } from 'express'
import { User } from '../models'
import { parseToNumber } from '../utils'
import { UserCreateDto, UserUpdateDto } from '../models/dto'
import { restrictToAdmin, authHandler, Tokens } from '@payhasly-discount/common'

@controller('users')
class UserController {
    @get('/')
    @use([authHandler(Tokens.accessToken, 'JWT_ACCESS'), restrictToAdmin()])
    async getUsers(req: Request, res: Response) {
        const { page, limit } = req.query

        if (!page || !limit)
            return res.status(400).send({
                errors: `${page ? "'page'" : "'limit'"} has to be defined`
            })

        const { parsedPage, parsedLimit } = parseToNumber(
            <{ [key: string]: string }>req.query
        )

        const count = await User.countDocuments()

        const users = await User.find()
            .skip(parsedPage * parsedLimit)
            .limit(parsedLimit)

        res.status(200).json({ count, users })
    }

    @post('/')
    @use([authHandler(Tokens.accessToken, 'JWT_ACCESS'), restrictToAdmin()])
    @bodyValidator(UserCreateDto)
    async createUser(req: Request, res: Response) {
        const { phone } = req.body

        const user = await User.findOne({ phone })
        if (user)
            return res.status(400).send({
                errors: `User with phone number '${phone}' already exists`
            })

        await User.create(req.body)

        res.status(201).send({ msg: 'User created successfully' })
    }

    @get('/:userId')
    @use([authHandler(Tokens.accessToken, 'JWT_ACCESS'), restrictToAdmin()])
    @paramsValidator(['userId'])
    async getUser(req: Request, res: Response) {
        const { userId } = req.params

        if (!(await User.findById(userId)))
            return res.status(404).send({
                errors: `User with id '${userId}' not found`
            })

        const user = await User.findById(userId)

        res.status(200).json({ user })
    }

    @put('/:userId')
    @use([authHandler(Tokens.accessToken, 'JWT_ACCESS'), restrictToAdmin()])
    @paramsValidator(['userId'])
    @bodyValidator(UserUpdateDto)
    async updateUser(req: Request, res: Response) {
        const { userId } = req.params
        const { phone, email, isAdmin, password } = req.body

        const user = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    phone,
                    email,
                    isAdmin,
                    password
                }
            },
            { new: true }
        )
        if (!user)
            return res.status(404).send({
                errors: `User with id '${userId}' not found`
            })
        res.status(204).json(user)
    }

    @del('/:userId')
    @use([authHandler(Tokens.accessToken, 'JWT_ACCESS'), restrictToAdmin()])
    @paramsValidator(['userId'])
    async deleteUser(req: Request, res: Response) {
        const { userId } = req.params

        const user = await User.findByIdAndDelete(userId)
        if (!user)
            return res.status(404).send({
                errors: `User with id '${userId}' not found`
            })

        res.status(204).end()
    }
}
