import { IsEmail, IsEnum, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { UserRole } from '../../entities/user.entity';

export class CreateUserRequestDto {
  @IsEmail() email: string;
  @IsString() name: string;

  @IsString() @MinLength(6)
  password: string;

  @IsOptional() @IsString()
  phone?: string;

  @IsOptional() @IsInt() @Min(0)
  age?: number;

  @IsOptional() @IsEnum(UserRole)
  role?: UserRole;
}
