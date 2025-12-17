import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

type Actor = { id?: number | null; email?: string | null } | null;

type AuditInput = {
  action: string;
  entity: string;
  entityId?: string | null;
  actor?: Actor;
  before?: any;
  after?: any;
  req?: {
    method?: string;
    path?: string;
    query?: any;
    body?: any;
    ip?: string;
    userAgent?: string;
  };
};

function maskSensitive(body: any) {
  if (!body || typeof body !== 'object') return body;
  const clone = { ...body };
  if ('password' in clone) clone.password = '***';
  if ('passwordHash' in clone) clone.passwordHash = '***';
  return clone;
}

@Injectable()
export class AuditService {
  constructor(@InjectRepository(AuditLog) private readonly repo: Repository<AuditLog>) {}

  async log(input: AuditInput) {
    const row = this.repo.create({
      action: input.action,
      entity: input.entity,
      entityId: input.entityId ?? null,
      actorId: input.actor?.id ?? null,
      actorEmail: input.actor?.email ?? null,
      before: input.before ?? null,
      after: input.after ?? null,
      method: input.req?.method ?? null,
      path: input.req?.path ?? null,
      query: input.req?.query ?? null,
      body: maskSensitive(input.req?.body ?? null),
      ip: input.req?.ip ?? null,
      userAgent: input.req?.userAgent ?? null,
    });
    await this.repo.save(row);
  }
}
