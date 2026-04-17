import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthUser } from '../types/auth-user.type';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization as string | undefined;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token ausente');
    }

    const token = authHeader.slice(7);

    try {
      const payload = this.jwtService.verify<AuthUser>(token, {
        secret: process.env.JWT_SECRET,
      });
      request.user = payload;
      request.tenantId = payload.tenantId;
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
  }
}
