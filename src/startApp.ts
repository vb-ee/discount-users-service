import 'reflect-metadata'
import bodyParser from 'body-parser'
import cors from 'cors'
import express, { Request, Response, NextFunction } from 'express'
import { AppRouter } from './utils'
import { accessEnv } from './utils/accessEnvs'
import './controllers/UserController'

const port = parseInt(accessEnv('PORT', '7070'), 10)

export const startApp = () => {
    // require('./controllers/UserController')

    const app = express()

    app.use(bodyParser.json())
    app.use(cors())

    app.use(AppRouter.getInstance())

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        return res.status(500).json({ message: err.message })
    })

    app.listen(port, '0.0.0.0', () => {
        console.info(`Users service listening on port ${port}`)
    })
}
