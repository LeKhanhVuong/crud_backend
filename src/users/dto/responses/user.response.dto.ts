import { UserRole } from "../../entities/user.entity";


export class UserResponseDto {
  id: number;
  email: string;
  name: string;
  phone: string | null;
  age: number | null;
  isActive: boolean;
  role: UserRole;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null; 

  createdBy: number | null;
  updatedBy: number | null;
  deletedBy: number | null;
}
