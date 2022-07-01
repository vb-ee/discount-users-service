import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'
import { NextFunction, RequestHandler, Request, Response } from 'express'

// This is validation pipe for req.body object
export const validateBody = (dtoClass: typeof Object): RequestHandler => {
    return function (req: Request, res: Response, next: NextFunction) {
        // Check if body exists
        if (!req.body) {
            res.status(422).send({ msg: 'Invalid Request' })
            return
        }

        // Converting req.body to dtoClass constructor
        const bodyToValidate = plainToClass(dtoClass, req.body, {
            excludeExtraneousValues: true
        })

        // validating
        validate(bodyToValidate, {
            forbidNonWhitelisted: true,
            skipMissingProperties: true
        }).then((errors) => {
            // Check if errors array is empty
            if (errors.length > 0) {
                let errorKeys: { [key: string]: string } = {}
                // looping through each item of errors array
                for (const errorItem of errors) {
                    // looping through each key:value of constraints object
                    for (const key in errorItem.constraints) {
                        // assign each key of consttraints object to errorKeys object
                        errorKeys[key] = errorItem.constraints[key]
                    }
                }
                console.log(errorKeys)
                // return error if any exists, with status code 400 as its bad request from client side
                return next(res.status(400).send({ errors: errorKeys }))
            } else {
                // Assign successfully validated body back to req.body object
                req.body = { ...bodyToValidate }
                next()
            }
        })
    }
}
