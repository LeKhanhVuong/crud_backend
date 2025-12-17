import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp without time zone', nullable: true })
  deletedAt?: Date | null;

  @Column({ type: 'int', nullable: true })
  createdBy?: number | null;

  @Column({ type: 'int', nullable: true })
  updatedBy?: number | null;

  @Column({ type: 'int', nullable: true })
  deletedBy?: number | null;
}
