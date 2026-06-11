const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.store.findUnique({where: {key: 'employees'}}).then(console.log).catch(console.error).finally(() => prisma.$disconnect());
