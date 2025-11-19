import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const streamingPlatforms = [
  {
    name: 'Netflix',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
  },
  {
    name: 'HBO Max',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/17/HBO_Max_Logo.svg',
  },
  {
    name: 'Disney+',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg',
  },
  {
    name: 'Prime Video',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png',
  },
  {
    name: 'Apple TV+',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg',
  },
  {
    name: 'Paramount+',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Paramount_Plus.svg',
  },
  {
    name: 'Star+',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Star_Plus_logo.svg',
  },
  {
    name: 'Cine',
    logo: null,
  },
  {
    name: 'Otro',
    logo: null,
  },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Seed streaming platforms
  for (const platform of streamingPlatforms) {
    await prisma.streamingPlatform.upsert({
      where: { name: platform.name },
      update: {},
      create: platform,
    });
  }

  console.log('✅ Streaming platforms seeded successfully!');
  console.log(`📊 Total platforms: ${streamingPlatforms.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
