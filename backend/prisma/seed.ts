/// <reference types="node" />

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const DEV_ADMIN = {
  name: 'Admin Desenvolvimento',
  email: 'admin.dev@smartinfo.co.mz',
  password: 'AdminDev123!',
};

const DEV_AGENT = {
  name: 'Agente Teste',
  code: '246810',
  phone: '840000001',
  latitude: -25.9692,
  longitude: 32.5732,
  reference: 'Mercado Central, Maputo',
};

const DEV_CLIENT = {
  name: 'Maria Joaquina',
  code: '123456',
  phone: '841234567',
  latitude: -25.9692,
  longitude: 32.5732,
};

async function main() {
  console.log('Seeding development data...');

  await prisma.user.upsert({
    where: { code: DEV_CLIENT.code },
    update: {
      name: DEV_CLIENT.name,
      phone: DEV_CLIENT.phone,
      latitude: DEV_CLIENT.latitude,
      longitude: DEV_CLIENT.longitude,
    },
    create: DEV_CLIENT,
  });

  const adminPassword = await bcrypt.hash(DEV_ADMIN.password, 10);
  await prisma.admin.upsert({
    where: { email: DEV_ADMIN.email },
    update: {
      name: DEV_ADMIN.name,
      password: adminPassword,
    },
    create: {
      name: DEV_ADMIN.name,
      email: DEV_ADMIN.email,
      password: adminPassword,
    },
  });

  const agentCode = await bcrypt.hash(DEV_AGENT.code, 10);
  await prisma.agent.upsert({
    where: { phone: DEV_AGENT.phone },
    update: {
      name: DEV_AGENT.name,
      password: agentCode,
      status: 'ONLINE',
      latitude: DEV_AGENT.latitude,
      longitude: DEV_AGENT.longitude,
      reference: DEV_AGENT.reference,
    },
    create: {
      name: DEV_AGENT.name,
      phone: DEV_AGENT.phone,
      password: agentCode,
      status: 'ONLINE',
      latitude: DEV_AGENT.latitude,
      longitude: DEV_AGENT.longitude,
      reference: DEV_AGENT.reference,
    },
  });

  console.log('Development seed complete.');
  console.log(`Admin: ${DEV_ADMIN.email} / ${DEV_ADMIN.password}`);
  console.log(`Agent: ${DEV_AGENT.name} / ${DEV_AGENT.code}`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
