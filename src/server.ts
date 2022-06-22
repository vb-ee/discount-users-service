import { initConnection } from './db/connection'
import 'dotenv/config'
import { accessEnv } from './utils/accessEnvs'

const mongoDbUri = accessEnv('MONGO_DB_URI')

initConnection(mongoDbUri)
    .then(() => {
        console.log('DB connection established successfully')
    })
    .catch((err) => console.log(err))
