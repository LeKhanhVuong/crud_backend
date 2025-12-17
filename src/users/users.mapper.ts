import { User } from './entities/user.entity';
import { UserResponseDto } from './dto/responses/user.response.dto';

export function toUserResponseDto(u: User): UserResponseDto {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    phone: u.phone ?? null,
    age: u.age ?? null,
    isActive: u.isActive,
    role: u.role,

    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString(),
    deletedAt: u.deletedAt ? u.deletedAt.toISOString() : null,

    createdBy: u.createdBy ?? null,
    updatedBy: u.updatedBy ?? null,
    deletedBy: u.deletedBy ?? null,
  };
}
