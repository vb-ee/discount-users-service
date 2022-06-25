import { AppRouter } from '../../utils'

export function controller(route: string) {
    return function (target: Function) {
        const router = AppRouter.getInstance()

        for (let key of Object.getOwnPropertyNames(target.prototype)) {
            const routeHandler = target.prototype[key]
            const path = Reflect.getMetadata('path', target.prototype, key)
            if (path) router.get(`${route}${path}`, routeHandler)
        }
    }
}
