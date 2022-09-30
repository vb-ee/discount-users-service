import 'reflect-metadata'
import { MetadataKeys } from './MetadataKeys'

// This custom decorator takes dto class as an argument and defines it as metadata key
export function bodyValidator(DtoClass: any) {
    return function (target: any, key: string, desc: PropertyDescriptor) {
        Reflect.defineMetadata(MetadataKeys.validator, DtoClass, target, key)
    }
}
