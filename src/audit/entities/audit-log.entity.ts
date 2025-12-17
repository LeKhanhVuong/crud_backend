import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;

  @Column({ type: 'int', nullable: true })
  actorId?: number | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  actorEmail?: string | null;

  @Column({ type: 'varchar', length: 50 })
  action: string; // CREATE/UPDATE/SOFT_DELETE/RESTORE/LOGIN

  @Column({ type: 'varchar', length: 50 })
  entity: string; // users/auth

  @Column({ type: 'varchar', length: 50, nullable: true })
  entityId?: string | null;

  @Column({ type: 'jsonb', nullable: true })
  before?: any;

  @Column({ type: 'jsonb', nullable: true })
  after?: any;

  @Column({ type: 'varchar', length: 10, nullable: true })
  method?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  path?: string | null;

  @Column({ type: 'jsonb', nullable: true })
  query?: any;

  @Column({ type: 'jsonb', nullable: true })
  body?: any;

  @Column({ type: 'varchar', length: 64, nullable: true })
  ip?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  userAgent?: string | null;
}
