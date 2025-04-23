import { Role } from '../../common/enums/role.enum';
import { User } from '../../modules/users/entities/user.entity';
import { DataSource } from 'typeorm';

export const seedUsers = async (dataSource: DataSource) => {
  const userRepository = dataSource.getRepository(User);

  // Check if admin user already exists
  const existingAdmin = await userRepository.findOne({
    where: { username: 'admin' },
  });

  if (!existingAdmin) {
    console.log('Creating admin user...');

    // Create admin user
    const admin = new User();
    admin.username = 'admin';
    admin.email = 'admin@example.com';
    admin.password = 'password123'; // Will be hashed by @BeforeInsert hook
    admin.role = Role.ADMIN;

    await userRepository.save(admin);
    console.log('Admin user created successfully');
  } else {
    console.log('Admin user already exists');
  }

  // Check if editor user already exists
  const existingEditor = await userRepository.findOne({
    where: { username: 'editor' },
  });

  if (!existingEditor) {
    console.log('Creating editor user...');

    // Create editor user
    const editor = new User();
    editor.username = 'editor';
    editor.email = 'editor@example.com';
    editor.password = 'password123'; // Will be hashed by @BeforeInsert hook
    editor.role = Role.EDITOR;

    await userRepository.save(editor);
    console.log('Editor user created successfully');
  } else {
    console.log('Editor user already exists');
  }
};
