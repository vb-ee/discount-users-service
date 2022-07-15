import 'reflect-metadata'
import { MetadataKeys } from './MetadataKeys'

// This custom decorator takes dto class as an argument and defines it as metadata key
export function paramsValidator(keys: string[]) {
    return function (
        target: typeof Object.prototype,
        key: string,
        desc: PropertyDescriptor
    ) {
        Reflect.defineMetadata(MetadataKeys.params, keys, target, key)
    }
}
