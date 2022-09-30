import { initConnection } from './db/connection'
import 'dotenv/config'
import { accessEnv } from './utils'
import { startApp } from './startApp'
import './controllers'

const mongoDbUri = accessEnv('MONGO_DB_URI')

initConnection(mongoDbUri)
    .then(() => {
        startApp()
    })
    .catch((err) => console.log(err.message))
