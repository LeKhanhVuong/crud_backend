import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../../users/entities/user.entity';
import { AuditService } from '../../audit/audit.service';
import { LoginResponseDto } from '../dto/responses/login.response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwt: JwtService,
    private readonly audit: AuditService,
  ) { }

  async login(email: string, password: string, reqMeta: any): Promise<LoginResponseDto> {
    const user = await this.userRepo
      .createQueryBuilder('u')
      .addSelect('u.passwordHash')
      .where('u.email = :email', { email })
      .andWhere('u.deletedAt IS NULL')
      .getOne();

    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (user.role !== UserRole.SUPER_ADMIN) throw new UnauthorizedException('Not super admin');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const expiresIn = 60 * 60 * 24; // 1 day
    const accessToken = await this.jwt.signAsync(
      { sub: user.id, email: user.email, role: user.role },
      { expiresIn },
    );

    await this.audit.log({
      action: 'LOGIN',
      entity: 'auth',
      entityId: String(user.id),
      actor: { id: user.id, email: user.email },
      before: null,
      after: { login: true },
      req: reqMeta,
    });

    return { accessToken, tokenType: 'Bearer', expiresIn };
  }
}
