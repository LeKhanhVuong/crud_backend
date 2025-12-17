import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../common/typeorm/base.entity';

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  USER = 'USER',
}

@Entity('users')
export class User extends BaseEntity {
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ type: 'varchar', length: 255, select: false })
  passwordHash: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  phone?: string | null;

  @Column({ type: 'int', nullable: true })
  age?: number | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;
}
