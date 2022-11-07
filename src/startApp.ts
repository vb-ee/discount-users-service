import bodyParser from 'body-parser'
import cors from 'cors'
import { AppRouter } from './utils'
import { errorHandler } from './middleware'
import express, { Application } from 'express'

export default class App {
    app: Application
    port: number

    constructor(port: number) {
        this.port = port
        this.app = express()
        this.app.use(cors())
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({ extended: true }))
        this.app.use(AppRouter.getInstance())
        this.app.use(errorHandler)
    }

    getApp() {
        return this.app
    }

    listen() {
        this.app.listen(this.port, '0.0.0.0', () => {
            console.info(`Users service listening on port ${this.port}`)
        })
    }
}
