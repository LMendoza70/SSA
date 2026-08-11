import { PrismaClient } from '../apps/api/src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as argon2 from 'argon2';
import { randomBytes } from 'crypto';

interface AdminInput {
  email: string;
  displayName: string;
  password: string;
}

function generatePassword(length = 24): string {
  return randomBytes(length).toString('base64url').slice(0, length);
}

async function createAdmin(input: AdminInput) {
  const prisma = new PrismaClient({ adapter: new PrismaPg(process.env.DATABASE_URL!) });

  try {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
      console.error(`ERROR: Ya existe un usuario con email "${input.email}".`);
      process.exit(1);
    }

    const passwordHash = await argon2.hash(input.password);
    const user = await prisma.user.create({
      data: {
        email: input.email,
        displayName: input.displayName,
        passwordHash,
        isActive: true,
      },
    });

    console.log(`Usuario administrativo creado:`);
    console.log(`  Email:       ${user.email}`);
    console.log(`  Nombre:      ${user.displayName}`);
    console.log(`  ID:          ${user.id}`);
    return user;
  } finally {
    await prisma.$disconnect();
  }
}

const email = process.argv[2];
const displayName = process.argv[3] || 'Administrador';
const password = process.argv[4] || generatePassword();

if (!email) {
  console.error('Uso: pnpm tsx scripts/create-admin.ts <email> [nombre] [password]');
  console.error('Si no se proporciona password, se genera una aleatoria.');
  process.exit(1);
}

createAdmin({ email, displayName, password }).catch((err) => {
  console.error('Error al crear administrador:', err);
  process.exit(1);
});
