import { get, controller } from './decorators'
import { Request, Response, NextFunction } from 'express'

@controller('/')
class UserController {
    @get('users')
    async getUsers(req: Request, res: Response) {
        res.send({ msg: 'Here should be users list' })
    }
}
