import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import { AppRouter, accessEnv } from './utils'
import { errorHandler } from './middleware'

const port = parseInt(accessEnv('PORT', '8080'), 10)

export const startApp = () => {
    const app = express()

    app.use(cors())
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))

    app.use(AppRouter.getInstance())

    app.use(errorHandler)

    app.listen(port, '0.0.0.0', () => {
        console.info(`Users service listening on port ${port}`)
    })
}
