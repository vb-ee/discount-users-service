import { Request, Response, NextFunction } from 'express'

export const asyncWrapper = (
    callback: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        callback(req, res, next).catch(next)
    }
}
