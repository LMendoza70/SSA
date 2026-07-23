import { PrismaClient } from '../apps/api/src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({ adapter: new PrismaPg(process.env.DATABASE_URL!) });

const ADMIN_HASH = '$argon2id$v=19$m=65536,t=3,p=4$RZ65S+cY2pdacgV1lRPp+g$tp4DOUkdQirMhUQSKb0YwzvvYQLSgWqAYaXV4TBB5N0';

const USERS = [
  { email: 'admin@jurisdiccion.gob.mx', displayName: 'Administrador', passwordHash: ADMIN_HASH, role: 'ADMIN' as const },
  { email: 'editor@jurisdiccion.gob.mx', displayName: 'Editor Principal', passwordHash: ADMIN_HASH, role: 'EDITOR' as const },
  { email: 'validador@jurisdiccion.gob.mx', displayName: 'Validadora', passwordHash: ADMIN_HASH, role: 'VALIDATOR' as const },
  { email: 'redactor@jurisdiccion.gob.mx', displayName: 'Redactor', passwordHash: ADMIN_HASH, role: 'WRITER' as const },
  { email: 'publicador@jurisdiccion.gob.mx', displayName: 'Publicador', passwordHash: ADMIN_HASH, role: 'PUBLISHER' as const },
  { email: 'auditor@jurisdiccion.gob.mx', displayName: 'Auditor', passwordHash: ADMIN_HASH, role: 'AUDITOR' as const },
];

const CONTENT_TYPES = [
  { code: 'news', name: 'Noticia', description: 'Artículo informativo sobre eventos o novedades' },
  { code: 'notice', name: 'Aviso', description: 'Comunicado breve de interés general' },
  { code: 'statement', name: 'Comunicado', description: 'Comunicado oficial de la institución' },
  { code: 'document', name: 'Documento', description: 'Documento oficial, informe o reporte' },
  { code: 'infographic', name: 'Infografía', description: 'Contenido visual informativo' },
  { code: 'faq', name: 'Pregunta Frecuente', description: 'Pregunta frecuente con su respuesta' },
  { code: 'program', name: 'Programa', description: 'Programa o iniciativa institucional' },
  { code: 'event', name: 'Evento', description: 'Evento programado por la institución' },
  { code: 'institutional', name: 'Información Institucional', description: 'Información general sobre la jurisdicción' },
];

async function main() {
  console.log('Seeding users...');

  for (const u of USERS) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { displayName: u.displayName, passwordHash: u.passwordHash, role: u.role },
      create: u,
    });
    console.log(`  ✅ ${u.email} (${u.role})`);
  }

  console.log('Seeding content types...');

  for (const ct of CONTENT_TYPES) {
    await prisma.contentType.upsert({
      where: { code: ct.code },
      update: { name: ct.name, description: ct.description },
      create: ct,
    });
    console.log(`  ✅ ${ct.code} - ${ct.name}`);
  }

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
