import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const firm = await prisma.firm.upsert({
    where: { slug: 'praxa-demo' },
    update: { name: 'Praxa Demo' },
    create: {
      name: 'Praxa Demo',
      slug: 'praxa-demo',
      users: {
        create: [
          {
            email: 'admin@praxa.demo',
            firstName: 'Firm',
            lastName: 'Admin',
            passwordHash: '$2b$12$wPW3EqOt8CCNnRTHAOKfD.bM2Lx4lKnA9ywd6bg9m4yxB4vQvY2fG',
          },
          {
            email: 'employee@praxa.demo',
            firstName: 'Firm',
            lastName: 'Employee',
            passwordHash: '$2b$12$wPW3EqOt8CCNnRTHAOKfD.bM2Lx4lKnA9ywd6bg9m4yxB4vQvY2fG',
          },
        ],
      },
    },
  });

  const perms = [
    'users.read',
    'users.create',
    'users.update',
    'users.delete',
    'clients.read',
    'clients.create',
    'clients.update',
    'clients.delete',
    'services.read',
    'services.create',
    'services.update',
    'services.delete',
    'billing.read',
    'billing.create',
    'billing.update',
    'billing.delete',
  ];

  for (const name of perms) {
    const [resource, action] = name.split('.');
    await prisma.permission.upsert({
      where: { name },
      update: {},
      create: { name, resource, action, description: name },
    });
  }

  for (const roleName of ['SUPER_ADMIN', 'FIRM_ADMIN', 'MANAGER', 'EMPLOYEE']) {
    await prisma.role.upsert({
      where: { firmId_name: { firmId: firm.id, name: roleName } },
      update: {},
      create: { firmId: firm.id, isSystem: true, name: roleName },
    });
  }
}

main().finally(async () => prisma.$disconnect());
