import { Request, Response, NextFunction } from 'express'

export const asyncWrapp = (
    callback: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        callback(req, res, next).catch(next)
    }
}
