import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UsersService } from '../services/users.service';
import { CreateUserRequestDto } from '../dto/requests/create-user.request.dto';
import { UpdateUserRequestDto } from '../dto/requests/update-user.request.dto';
import { ListUsersRequestDto } from '../dto/requests/list-users.request.dto';
import { CreateUserResponseDto } from '../dto/responses/create-user.response.dto';
import { UpdateUserResponseDto } from '../dto/responses/update-user.response.dto';
import { ListUsersResponseDto } from '../dto/responses/list-users.response.dto';
import { SoftDeleteUserResponseDto } from '../dto/responses/soft-delete-user.response.dto';
import { RestoreUserResponseDto } from '../dto/responses/restore-user.response.dto';
import { toUserResponseDto } from '../users.mapper';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) { }

  @Post()
  async create(@Body() dto: CreateUserRequestDto, @Req() req: any): Promise<CreateUserResponseDto> {
    const user = await this.users.create(dto, req.user, this.reqMeta(req, dto, true));
    return toUserResponseDto(user);
  }

  @Get()
  async list(@Query() dto: ListUsersRequestDto): Promise<ListUsersResponseDto> {
    const { items, total, page, limit } = await this.users.list(dto);
    return { items: items.map(toUserResponseDto), total, page, limit };
  }

  @Get(':id')
  async get(
    @Param('id') id: string,
    @Query('includeDeleted') includeDeleted?: any,
  ) {
    const user = await this.users.getById(Number(id), includeDeleted === 'true' || includeDeleted === true);
    return toUserResponseDto(user);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserRequestDto, @Req() req: any): Promise<UpdateUserResponseDto> {
    const user = await this.users.update(Number(id), dto, req.user, this.reqMeta(req, dto, true));
    return toUserResponseDto(user);
  }

  @Delete(':id')
  async softDelete(@Param('id') id: string, @Req() req: any): Promise<SoftDeleteUserResponseDto> {
    const result = await this.users.softDelete(Number(id), req.user, this.reqMeta(req, null));
    return result;
  }

  @Patch(':id/restore') 
  async restore(@Param('id') id: string, @Req() req: any): Promise<RestoreUserResponseDto> {
    const user = await this.users.restore(Number(id), req.user, this.reqMeta(req, null));
    return toUserResponseDto(user);
  }

  private reqMeta(req: any, body: any, maskPassword = false) {
    const safeBody =
      maskPassword && body?.password ? { ...body, password: '***' } : body;

    return {
      method: req.method,
      path: req.originalUrl || req.url,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      query: req.query,
      body: safeBody,
    };
  }
}
