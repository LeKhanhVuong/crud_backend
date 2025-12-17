import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditModule } from './audit/audit.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

const isProd = process.env.NODE_ENV === 'production';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'db_user',
      password: process.env.DB_PASSWORD || '123456',
      database: process.env.DB_DATABASE || 'db_crud_project',
      synchronize: false,
      logging: true,
      autoLoadEntities: true,
    }),
    AuditModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule { }
