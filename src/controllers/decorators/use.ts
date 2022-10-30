import 'reflect-metadata'
import { MetadataKeys } from './MetadataKeys'
import { RequestHandler } from 'express'
import { RouteHandlerDescriptor } from './routes'

export function use(middleware: RequestHandler) {
    return function (
        target: typeof Object.prototype,
        key: string,
        desc: RouteHandlerDescriptor
    ) {
        const middlewares =
            Reflect.getMetadata(MetadataKeys.middleware, target, key) || []

        Reflect.defineMetadata(
            MetadataKeys.middleware,
            [...middlewares, middleware],
            target,
            key
        )
    }
}
