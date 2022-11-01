import 'reflect-metadata'
import { MetadataKeys } from './MetadataKeys'
import { RequestHandler } from 'express'
import { RouteHandlerDescriptor } from './routes'

export function use(middlewares: RequestHandler[]) {
    return function (
        target: typeof Object.prototype,
        key: string,
        desc: RouteHandlerDescriptor
    ) {
        Reflect.defineMetadata(
            MetadataKeys.middleware,
            middlewares,
            target,
            key
        )
    }
}
