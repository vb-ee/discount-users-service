import { initConnection } from './db/connection'
import { accessEnv } from '@payhasly-discount/common'
import './controllers'

const port = parseInt(accessEnv('PORT', '8080'), 10)
const mongoDbUri = accessEnv('MONGO_DB_URI')
const App = require('./startApp').default
const app = new App(port)

initConnection(mongoDbUri)
    .then(() => {
        app.listen()
    })
    .catch((err) => console.log(err.message))
