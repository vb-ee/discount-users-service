import { IJwtPayload } from '../utils'

declare global {
    namespace Express {
        interface Request {
            payload: IJwtPayload
        }
    }
}
