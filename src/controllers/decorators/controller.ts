import 'reflect-metadata'
import { validateParams } from '../../middleware'
import { validateBody } from '../../middleware/validateBody'
import { AppRouter, asyncWrapper } from '../../utils'
import { MetadataKeys } from './MetadataKeys'
import { Methods } from './Methods'

// Custom factory decorator for controller classes
export function controller(prefix: string) {
    return function (target: Function) {
        // Getting router instance from AppRouter Singleton
        const router = AppRouter.getInstance()

        // Iterating over every function of controller class's object
        for (let key of Object.getOwnPropertyNames(target.prototype)) {
            // Assigning the class object's function to a variable
            const routeHandler = asyncWrapper(target.prototype[key])
            let validationMiddlewares = []
            // Getting metadata keys
            const path = Reflect.getMetadata(
                MetadataKeys.path,
                target.prototype,
                key
            )

            const method: Methods = Reflect.getMetadata(
                MetadataKeys.method,
                target.prototype,
                key
            )

            const paramsKeys = Reflect.getMetadata(
                MetadataKeys.params,
                target.prototype,
                key
            )

            const dtoClassToValidate = Reflect.getMetadata(
                MetadataKeys.validator,
                target.prototype,
                key
            )

            const middlewares =
                Reflect.getMetadata(
                    MetadataKeys.middleware,
                    target.prototype,
                    key
                ) || []

            if (paramsKeys)
                validationMiddlewares.push(validateParams(paramsKeys))
            else if (dtoClassToValidate)
                validationMiddlewares.push(validateBody(dtoClassToValidate))
            else validationMiddlewares = []

            // If function has path metadata key execute the routeHandler
            if (path)
                router[method](
                    `/${prefix}${path}`,
                    ...middlewares,
                    ...validationMiddlewares,
                    routeHandler
                )
        }
    }
}
