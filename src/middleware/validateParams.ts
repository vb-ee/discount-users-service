import { NextFunction, RequestHandler, Request, Response } from 'express'

// This is validation for req.params object
export const validateParams = (keys: string[]): RequestHandler => {
    return function (req: Request, res: Response, next: NextFunction) {
        // Check if params exists
        if (!req.params) {
            res.status(422).send({ msg: 'Invalid Request' })
            return
        }

        for (let key in keys) {
            if (!(key in req.params))
                return res.status(409).send({ msg: `${key} has to be defined` })
        }

        next()
    }
}
