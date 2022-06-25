import { get, controller } from './decorators'
import { Request, Response, NextFunction } from 'express'

@controller('/')
class UserController {
    @get('users')
    getUsers(req: Request, res: Response): void {
        res.send({ msg: 'Here should be users list' })
    }
}
