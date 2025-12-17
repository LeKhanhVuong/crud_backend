import 'reflect-metadata';
import { config } from 'dotenv';
import * as bcrypt from 'bcrypt';
import dataSource from '../data-source';
import { User, UserRole } from '../users/entities/user.entity';

config();

async function main() {
  const email = process.env.SEED_SUPER_ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.SEED_SUPER_ADMIN_PASSWORD || '123456';

  await dataSource.initialize();
  const repo = dataSource.getRepository(User);

  const exists = await repo.findOne({ where: { email }, withDeleted: true });
  if (exists) {
    console.log(`Super admin already exists: ${email}`);
    await dataSource.destroy();
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const admin = repo.create({
    email,
    name: 'Super Admin',
    passwordHash,
    role: UserRole.SUPER_ADMIN,
    isActive: true,
  });

  await repo.save(admin);
  console.log(`Seeded super admin: ${email} / ${password}`);
  await dataSource.destroy();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
