import { initConnection } from './db/connection'
import 'dotenv/config'

initConnection(<string>process.env.MONGO_DB_URI)
    .then(() => {
        console.log('DB connection established successfully')
    })
    .catch((err) => console.log(err))
