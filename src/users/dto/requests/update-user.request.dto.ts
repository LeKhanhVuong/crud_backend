import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { UserRole } from '../../entities/user.entity';

export class UpdateUserRequestDto {
  @IsOptional() @IsString()
  name?: string;

  @IsOptional() @IsString()
  phone?: string | null;

  @IsOptional() @IsInt() @Min(0)
  age?: number | null;

  @IsOptional() @IsBoolean()
  isActive?: boolean;

  @IsOptional() @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional() @IsString() @MinLength(6)
  password?: string;
}
