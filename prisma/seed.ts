import { PrismaClient } from '../apps/api/src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({ adapter: new PrismaPg(process.env.DATABASE_URL!) });

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
