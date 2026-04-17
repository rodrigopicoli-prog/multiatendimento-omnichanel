import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class TenantsService {
  constructor(private readonly prisma: PrismaService) {}
  me(tenantId: string) {
    return this.prisma.tenant.findUnique({ where: { id: tenantId } });
  }
}
