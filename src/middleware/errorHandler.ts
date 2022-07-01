import { NextFunction, Request, Response } from 'express'

interface MongoError extends Error {
    code: number
}

export const errorHandler = (
    err: MongoError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode: number

    console.log(err)

    if (err.name === 'ValidationError') {
        statusCode = 400
    }

    if (err.code && err.code === 11000) {
        statusCode = 409
    } else statusCode = 500

    return res.status(statusCode).send({ error: err.message })
}
