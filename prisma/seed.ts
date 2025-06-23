import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.role.deleteMany();
  await prisma.course.deleteMany();

  // Skills
  const skills = [
    { id: 'stat-dist', title: 'Statistical Distributions', description: 'Understand probability distributions', image: '', prereqIds: [] },
    { id: 't-tests', title: 't-Tests', description: 'Perform hypothesis testing', image: '', prereqIds: ['stat-dist'] },
    { id: 'conf-int', title: 'Confidence Intervals', description: 'Estimate ranges', image: '', prereqIds: ['stat-dist'] },
    { id: 'regression', title: 'Regression', description: 'Fit linear models', image: '', prereqIds: ['t-tests','conf-int'] },
  ];

  for (const s of skills) {
    await prisma.skill.create({
      data: {
        id: s.id,
        title: s.title,
        description: s.description,
        image: s.image,
      },
    });
  }

  for (const s of skills) {
    for (const prereq of s.prereqIds) {
      await prisma.skillRelation.create({ data: { fromId: prereq, toId: s.id } });
    }
  }

  // Role
  await prisma.role.create({
    data: {
      id: 'statistician',
      title: 'Statistician',
      description: 'Expert in statistical analysis',
      roleSkills: {
        create: ['stat-dist', 't-tests', 'conf-int'].map((skillId) => ({ skill: { connect: { id: skillId } } })),
      },
    },
  });

  // Course
  await prisma.course.create({
    data: {
      id: 'stat-learning',
      title: 'Statistical Learning',
      description: 'Covers hypothesis testing and regression',
      courseSkills: {
        create: ['stat-dist', 't-tests', 'conf-int', 'regression'].map((skillId) => ({ skill: { connect: { id: skillId } } })),
      },
    },
  });
}

main().catch((e) => console.error(e)).finally(() => prisma.$disconnect());
