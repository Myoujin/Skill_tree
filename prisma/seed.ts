import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.role.deleteMany();
  await prisma.course.deleteMany();

  // Skills
  await prisma.skill.createMany({
    data: [
      { id: 'stat-dist', title: 'Statistical Distributions', description: 'Understand probability distributions', image: '', prereqIds: [] },
      { id: 't-tests', title: 't-Tests', description: 'Perform hypothesis testing', image: '', prereqIds: ['stat-dist'] },
      { id: 'conf-int', title: 'Confidence Intervals', description: 'Estimate ranges', image: '', prereqIds: ['stat-dist'] },
      { id: 'regression', title: 'Regression', description: 'Fit linear models', image: '', prereqIds: ['t-tests','conf-int'] },
    ],
  });

  // Role
  await prisma.role.create({
    data: {
      id: 'statistician',
      title: 'Statistician',
      description: 'Expert in statistical analysis',
      requiredSkillIds: ['stat-dist', 't-tests', 'conf-int'],
    },
  });

  // Course
  await prisma.course.create({
    data: {
      id: 'stat-learning',
      title: 'Statistical Learning',
      description: 'Covers hypothesis testing and regression',
      skillIds: ['stat-dist', 't-tests', 'conf-int', 'regression'],
    },
  });
}

main().catch((e) => console.error(e)).finally(() => prisma.$disconnect());
