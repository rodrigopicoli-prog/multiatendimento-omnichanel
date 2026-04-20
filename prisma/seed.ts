import { PrismaClient, Role, ChannelType } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'default' },
    update: {},
    create: { name: 'Tenant Padrão', slug: 'default' },
  });

  const adminPassword = await hash('Admin@123456', 10);

  await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'admin@local.test' } },
    update: { role: Role.ADMIN, isActive: true },
    create: {
      tenantId: tenant.id,
      name: 'Administrador',
      email: 'admin@local.test',
      passwordHash: adminPassword,
      role: Role.ADMIN,
      isActive: true,
    },
  });

  const queues = [
    { name: 'Comercial', color: '#2563eb', sortOrder: 1 },
    { name: 'Suporte', color: '#16a34a', sortOrder: 2 },
    { name: 'Financeiro', color: '#d97706', sortOrder: 3 },
  ];

  for (const queue of queues) {
    await prisma.queue.upsert({
      where: { tenantId_name: { tenantId: tenant.id, name: queue.name } },
      update: queue,
      create: { tenantId: tenant.id, ...queue },
    });
  }

  await prisma.channel.upsert({
    where: { id: 'seed-whatsapp-channel' },
    update: {},
    create: {
      id: 'seed-whatsapp-channel',
      tenantId: tenant.id,
      type: ChannelType.WHATSAPP,
      name: 'WhatsApp Principal',
    },
  });

  const stages = [
    { name: 'Entrada', position: 1, color: '#64748b' },
    { name: 'Em Atendimento', position: 2, color: '#3b82f6' },
    { name: 'Resolvido', position: 3, color: '#10b981' },
  ];

  for (const stage of stages) {
    await prisma.kanbanStage.upsert({
      where: { tenantId_position: { tenantId: tenant.id, position: stage.position } },
      update: stage,
      create: { tenantId: tenant.id, ...stage },
    });
  }

  console.log('Seed concluído', {
    tenantSlug: tenant.slug,
    adminEmail: 'admin@local.test',
    adminPassword: 'Admin@123456',
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
