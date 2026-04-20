import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { PrismaService } from '../common/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly auditService: AuditService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email, isActive: true },
      include: { tenant: true },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const validPassword = await compare(dto.password, user.passwordHash);
    if (!validPassword) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const accessToken = this.jwtService.sign(
      {
        userId: user.id,
        tenantId: user.tenantId,
        role: user.role,
        email: user.email,
      },
      { secret: process.env.JWT_SECRET, expiresIn: '15m' },
    );

    const refreshToken = this.jwtService.sign(
      {
        userId: user.id,
        tenantId: user.tenantId,
        role: user.role,
      },
      { secret: process.env.JWT_SECRET, expiresIn: '30d' },
    );

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash: await hash(refreshToken, 10) },
    });

    await this.auditService.log({
      tenantId: user.tenantId,
      userId: user.id,
      action: 'AUTH_LOGIN',
      resource: 'auth',
      payload: { email: user.email },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
      },
    };
  }

  async refresh(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken, { secret: process.env.JWT_SECRET }) as {
      userId: string;
      tenantId: string;
      role: string;
    };

    const user = await this.prisma.user.findFirst({
      where: { id: payload.userId, tenantId: payload.tenantId, isActive: true },
    });

    if (!user?.refreshTokenHash) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    const valid = await compare(refreshToken, user.refreshTokenHash);
    if (!valid) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    const accessToken = this.jwtService.sign(
      {
        userId: user.id,
        tenantId: user.tenantId,
        role: user.role,
        email: user.email,
      },
      { secret: process.env.JWT_SECRET, expiresIn: '15m' },
    );

    return { accessToken };
  }

  async me(userId: string, tenantId: string) {
    return this.prisma.user.findFirst({
      where: { id: userId, tenantId },
      select: { id: true, name: true, email: true, role: true, avatarUrl: true, isActive: true, tenantId: true },
    });
  }

  async logout(userId: string, tenantId: string) {
    await this.prisma.user.updateMany({
      where: { id: userId, tenantId },
      data: { refreshTokenHash: null },
    });

    await this.auditService.log({
      tenantId,
      userId,
      action: 'AUTH_LOGOUT',
      resource: 'auth',
    });

    return { success: true };
  }
}
