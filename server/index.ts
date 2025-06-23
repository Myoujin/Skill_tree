import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import cookieParser from 'cookie-parser';

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cookieParser());

const JWT_SECRET = 'secret';

function createToken(userId: number) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

function auth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
  if (!token) return res.status(401).json({ error: 'unauthenticated' });
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number };
    (req as any).userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: 'invalid token' });
  }
}

app.post('/api/auth/register', async (req, res) => {
  const { email, pw } = req.body;
  const hashed = await bcrypt.hash(pw, 10);
  const user = await prisma.user.create({ data: { email, password: hashed } });
  const token = createToken(user.id);
  res.json({ token });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, pw } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(pw, user.password))) {
    return res.status(401).json({ error: 'invalid credentials' });
  }
  const token = createToken(user.id);
  res.json({ token });
});

app.get('/api/me', auth, async (req, res) => {
  const userId = (req as any).userId;
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { userSkills: true } });
  res.json({ id: user?.id, email: user?.email, completedSkillIds: user?.userSkills.map((us) => us.skillId) });
});

app.get('/api/tree', auth, async (req, res) => {
  const userId = (req as any).userId;
  const [skills, roles, courses, userSkills] = await Promise.all([
    prisma.skill.findMany(),
    prisma.role.findMany(),
    prisma.course.findMany(),
    prisma.userSkill.findMany({ where: { userId } }),
  ]);
  res.json({ skills, roles, courses, completedSkillIds: userSkills.map((u) => u.skillId) });
});

app.post('/api/skill/:id/complete', auth, async (req, res) => {
  const userId = (req as any).userId;
  const skillId = req.params.id;
  await prisma.userSkill.upsert({
    where: { userId_skillId: { userId, skillId } },
    create: { userId, skillId },
    update: {},
  });
  res.json({ ok: true });
});

app.listen(4000, () => console.log('Server started on http://localhost:4000'));
