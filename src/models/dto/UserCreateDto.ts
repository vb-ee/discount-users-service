import { Expose } from 'class-transformer'
import {
    IsBoolean,
    IsDefined,
    IsEmail,
    IsNumberString,
    IsString,
    MinLength
} from 'class-validator'
import { IUser } from '../User'

// Dto class for validation when the user created
export class UserCreateDto {
    @IsDefined()
    @IsEmail()
    @Expose()
    email: IUser['email']

    @IsDefined()
    @IsNumberString()
    @Expose()
    phone: IUser['phone']

    @IsDefined()
    @IsString()
    @MinLength(6)
    @Expose()
    password: IUser['password']

    @IsBoolean()
    @Expose()
    isAdmin: IUser['isAdmin'] = false
}
