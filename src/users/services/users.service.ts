import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuditService } from '../../audit/audit.service';
import { User, UserRole } from '../entities/user.entity';
import { CreateUserRequestDto } from '../dto/requests/create-user.request.dto';
import { UpdateUserRequestDto } from '../dto/requests/update-user.request.dto';
import { ListUsersRequestDto } from '../dto/requests/list-users.request.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    private readonly audit: AuditService,
  ) { }

  private auditSafe(u: Partial<User>) {
    const { passwordHash, ...safe } = u as any;
    return safe;
  }

  async create(dto: CreateUserRequestDto, actor: any, reqMeta: any): Promise<User> {
    const exists = await this.repo.exist({ where: { email: dto.email } });
    if (exists) throw new BadRequestException('Email already exists');

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = this.repo.create({
      email: dto.email,
      name: dto.name,
      phone: dto.phone ?? null,
      age: dto.age ?? null,
      isActive: true,
      role: dto.role ?? UserRole.USER,
      passwordHash,
      createdBy: actor.id,
      updatedBy: actor.id,
    });

    const saved = await this.repo.save(user);

    await this.audit.log({
      action: 'CREATE',
      entity: 'users',
      entityId: String(saved.id),
      actor: { id: actor.id, email: actor.email },
      before: null,
      after: this.auditSafe(saved),
      req: reqMeta,
    });

    return saved;
  }

  async getById(id: number, includeDeleted: boolean): Promise<User> {
    const qb = this.repo.createQueryBuilder('u').where('u.id = :id', { id });
    if (includeDeleted) qb.withDeleted();
    const user = await qb.getOne();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async list(dto: ListUsersRequestDto) {
    const { page = 1, limit = 20, q, role, isActive, includeDeleted } = dto;
    const qb = this.repo.createQueryBuilder('u');

    if (includeDeleted) qb.withDeleted();

    if (q) {
      qb.andWhere('(u.email ILIKE :q OR u.name ILIKE :q OR u.phone ILIKE :q)', { q: `%${q}%` });
    }
    if (role) qb.andWhere('u.role = :role', { role });
    if (typeof isActive === 'boolean') qb.andWhere('u.isActive = :isActive', { isActive });

    qb.orderBy('u.id', 'DESC').skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit };
  }

  async update(id: number, dto: UpdateUserRequestDto, actor: any, reqMeta: any): Promise<User> {
    const user = await this.repo
      .createQueryBuilder('u')
      .addSelect('u.passwordHash')
      .where('u.id = :id', { id })
      .getOne();

    if (!user) throw new NotFoundException('User not found');

    const before = this.auditSafe(user);

    if (dto.password) user.passwordHash = await bcrypt.hash(dto.password, 10);
    if (dto.name !== undefined) user.name = dto.name;
    if (dto.phone !== undefined) user.phone = dto.phone;
    if (dto.age !== undefined) user.age = dto.age as any;
    if (dto.isActive !== undefined) user.isActive = dto.isActive;
    if (dto.role !== undefined) user.role = dto.role;

    user.updatedBy = actor.id;

    const saved = await this.repo.save(user);

    await this.audit.log({
      action: 'UPDATE',
      entity: 'users',
      entityId: String(saved.id),
      actor: { id: actor.id, email: actor.email },
      before,
      after: this.auditSafe(saved),
      req: reqMeta,
    });

    return saved;
  }

  async softDelete(id: number, actor: any, reqMeta: any) {
    const user = await this.getById(id, true);
    const before = this.auditSafe(user);

    await this.repo.update({ id }, { deletedBy: actor.id, updatedBy: actor.id });
    await this.repo.softDelete(id);

    await this.audit.log({
      action: 'SOFT_DELETE',
      entity: 'users',
      entityId: String(id),
      actor: { id: actor.id, email: actor.email },
      before,
      after: { deletedAt: new Date().toISOString(), deletedBy: actor.id },
      req: reqMeta,
    });

    return { ok: true as const };
  }

  async restore(id: number, actor: any, reqMeta: any): Promise<User> {
    const user = await this.getById(id, true);
    const before = this.auditSafe(user);

    await this.repo.restore(id);
    await this.repo.update({ id }, { deletedBy: null, updatedBy: actor.id });

    const after = await this.getById(id, false);

    await this.audit.log({
      action: 'RESTORE',
      entity: 'users',
      entityId: String(id),
      actor: { id: actor.id, email: actor.email },
      before,
      after: this.auditSafe(after),
      req: reqMeta,
    });

    return after;
  }
}
