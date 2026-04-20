import { Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { PrismaService } from '../common/prisma/prisma.service';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService, private readonly auditService: AuditService) {}
  async create(tenantId: string, actorId: string, dto: CreateUserDto) {
    const created = await this.prisma.user.create({ data: { tenantId, name: dto.name, email: dto.email, passwordHash: await hash(dto.password, 10), role: dto.role, avatarUrl: dto.avatarUrl }, select: { id: true, name: true, email: true, role: true, avatarUrl: true, isActive: true } });
    await this.auditService.log({ tenantId, userId: actorId, action: 'USER_CREATED', resource: 'users', payload: created });
    return created;
  }
  list(tenantId: string, query: PaginationQueryDto) {
    return this.prisma.user.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' }, skip: (query.page - 1) * query.limit, take: query.limit, select: { id: true, name: true, email: true, role: true, avatarUrl: true, isActive: true, createdAt: true } });
  }
  async findOne(tenantId: string, id: string) {
    const user = await this.prisma.user.findFirst({ where: { id, tenantId }, select: { id: true, name: true, email: true, role: true, avatarUrl: true, isActive: true } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }
  async update(tenantId: string, id: string, actorId: string, dto: UpdateUserDto) {
    await this.findOne(tenantId, id);
    const user = await this.prisma.user.update({ where: { id }, data: { name: dto.name, email: dto.email, role: dto.role, avatarUrl: dto.avatarUrl, isActive: dto.isActive, ...(dto.password ? { passwordHash: await hash(dto.password, 10) } : {}) }, select: { id: true, name: true, email: true, role: true, avatarUrl: true, isActive: true } });
    await this.auditService.log({ tenantId, userId: actorId, action: 'USER_UPDATED', resource: 'users', payload: { id, changes: dto } });
    return user;
  }
}
