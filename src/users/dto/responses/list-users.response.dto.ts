import { UserResponseDto } from './user.response.dto';

export class ListUsersResponseDto {
  items: UserResponseDto[];
  total: number;
  page: number;
  limit: number;
}
