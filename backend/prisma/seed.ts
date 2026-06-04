import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 A semear dados fictícios...');

  // ── Cliente fictício ──
  // Login: nome = "Maria Joaquina", código = "123456"
  const existingUser = await prisma.user.findUnique({ where: { code: '123456' } });
  if (!existingUser) {
    const user = await prisma.user.create({
      data: {
        name: 'Maria Joaquina',
        code: '123456',
        phone: '841234567',
        latitude: -25.9692,
        longitude: 32.5732,
      },
    });
    console.log('✅ Cliente criado:', user.name);
    console.log('   Nome: Maria Joaquina');
    console.log('   Código: 123456');
  } else {
    console.log('ℹ️  Cliente "Maria Joaquina" já existe.');
  }

  // ── Admin fictício ──
  // Login: email = "admin@smartinfo.co.mz", senha = "admin123"
  const existingAdmin = await prisma.admin.findUnique({ where: { email: 'admin@smartinfo.co.mz' } });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.admin.create({
      data: {
        name: 'Carlos Administrador',
        email: 'admin@smartinfo.co.mz',
        password: hashedPassword,
      },
    });
    console.log('✅ Admin criado:', admin.name);
    console.log('   Email: admin@smartinfo.co.mz');
    console.log('   Senha: admin123');
  } else {
    console.log('ℹ️  Admin "Carlos Administrador" já existe.');
  }

  console.log('\n🎉 Seed concluído! Use as credenciais acima para fazer login.');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
