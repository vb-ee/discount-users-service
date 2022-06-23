import bodyParser from 'body-parser'
import cors from 'cors'
import express, { Request, Response, NextFunction } from 'express'
import { accessEnv } from './utils/accessEnvs'

const port = parseInt(accessEnv('PORT', '7070'), 10)

export const startApp = () => {
    const app = express()

    app.use(bodyParser.json())
    app.use(cors())

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        return res.status(500).json({ message: err.message })
    })

    app.listen(port, '0.0.0.0', () => {
        console.info(`Users service listening on port ${port}`)
    })
}
