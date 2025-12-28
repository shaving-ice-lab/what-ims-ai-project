import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, Admin, UserRole } from '../entities';

const DEFAULT_ADMIN_USERNAME = 'admin';
const DEFAULT_ADMIN_PASSWORD = 'admin123456';
const DEFAULT_ADMIN_NAME = '主管理员';

async function seedAdmin() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'what_ims',
    entities: [User, Admin],
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log('数据库连接成功');

    const userRepository = dataSource.getRepository(User);
    const adminRepository = dataSource.getRepository(Admin);

    const existingAdmin = await adminRepository.findOne({
      where: { isPrimary: 1 },
    });

    if (existingAdmin) {
      console.log('主管理员已存在，跳过创建');
      await dataSource.destroy();
      return;
    }

    const existingUser = await userRepository.findOne({
      where: { username: DEFAULT_ADMIN_USERNAME },
    });

    if (existingUser) {
      console.log(`用户名 ${DEFAULT_ADMIN_USERNAME} 已存在，跳过创建`);
      await dataSource.destroy();
      return;
    }

    const passwordHash = bcrypt.hashSync(DEFAULT_ADMIN_PASSWORD, 10);

    const user = userRepository.create({
      username: DEFAULT_ADMIN_USERNAME,
      passwordHash,
      role: UserRole.ADMIN,
      status: 1,
    });

    const savedUser = await userRepository.save(user);
    console.log(`用户创建成功，ID: ${savedUser.id}`);

    const admin = adminRepository.create({
      userId: savedUser.id,
      name: DEFAULT_ADMIN_NAME,
      isPrimary: 1,
      isSuperAdmin: 1,
      permissions: [],
      status: 1,
    });

    const savedAdmin = await adminRepository.save(admin);
    console.log(`主管理员创建成功，ID: ${savedAdmin.id}`);

    console.log('');
    console.log('========================================');
    console.log('主管理员账号信息：');
    console.log(`  用户名: ${DEFAULT_ADMIN_USERNAME}`);
    console.log(`  密码: ${DEFAULT_ADMIN_PASSWORD}`);
    console.log('  ⚠️  请首次登录后立即修改密码！');
    console.log('========================================');

    await dataSource.destroy();
    console.log('数据库连接已关闭');
  } catch (error) {
    console.error('Seed失败:', error);
    process.exit(1);
  }
}

seedAdmin();
