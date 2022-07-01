import bodyParser from 'body-parser'
import cors from 'cors'
import express, { Request, Response, NextFunction } from 'express'
import { AppRouter } from './utils'
import { accessEnv } from './utils/accessEnvs'
import './controllers'
import { errorHandler } from './middleware'

const port = parseInt(accessEnv('PORT', '7070'), 10)

export const startApp = () => {
    // require('./controllers/UserController')

    const app = express()

    app.use(bodyParser.json())
    app.use(cors())

    app.use(AppRouter.getInstance())

    app.use(errorHandler)

    app.listen(port, '0.0.0.0', () => {
        console.info(`Users service listening on port ${port}`)
    })
}
