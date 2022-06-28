import { RequestHandler } from 'express'
import 'reflect-metadata'
import { MetadataKeys } from './MetadataKeys'
import { Methods } from './Methods'

interface RouteHandlerDescriptor extends PropertyDescriptor {
    value?: RequestHandler
}

// Custom factory decorator for different routes
function routeBind(method: string) {
    return function (path: string) {
        return function (
            target: typeof Object.prototype,
            key: string,
            desc: RouteHandlerDescriptor
        ) {
            // Defining metadata keys to controller class object
            Reflect.defineMetadata(MetadataKeys.path, path, target, key)
            Reflect.defineMetadata(MetadataKeys.method, method, target, key)
        }
    }
}

// Defining and exporting routes
export const get = routeBind(Methods.get)
export const post = routeBind(Methods.post)
export const put = routeBind(Methods.put)
export const del = routeBind(Methods.del)
