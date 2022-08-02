import { Expose } from 'class-transformer'
import { IsBoolean, IsNumberString, IsString, MinLength } from 'class-validator'
import { IUser } from '../User'

// Dto class for validation when the user updated
export class UserUpdateDto {
    @IsNumberString()
    @Expose()
    phone: IUser['phone']

    @IsString()
    @MinLength(6)
    @Expose()
    password: IUser['password']

    @IsBoolean()
    @Expose()
    isAdmin?: IUser['isAdmin']
}
