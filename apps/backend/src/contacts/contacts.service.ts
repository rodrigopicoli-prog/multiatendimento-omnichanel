import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}
  create(tenantId: string, dto: any) { return this.prisma.contact.create({ data: { tenantId, ...dto } }); }
  list(tenantId: string, query: PaginationQueryDto, search?: string) { return this.prisma.contact.findMany({ where: { tenantId, OR: search ? [{ name: { contains: search, mode: 'insensitive' } }, { phone: { contains: search } }, { email: { contains: search, mode: 'insensitive' } }] : undefined }, include: { contactTags: { include: { tag: true } } }, skip: (query.page - 1) * query.limit, take: query.limit, orderBy: { updatedAt: 'desc' } }); }
  detail(tenantId: string, id: string) { return this.prisma.contact.findFirst({ where: { id, tenantId }, include: { contactTags: { include: { tag: true } }, conversations: { take: 5, orderBy: { lastMessageAt: 'desc' }, select: { id: true, status: true, lastMessageAt: true, lastMessagePreview: true } } } }); }
  update(tenantId: string, id: string, dto: any) { return this.prisma.contact.updateMany({ where: { id, tenantId }, data: dto }); }
}
