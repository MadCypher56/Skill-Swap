import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seed() {
  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@skillswap.com' },
      update: {},
      create: {
        name: 'Admin User',
        email: 'admin@skillswap.com',
        password: hashedPassword,
        role: 'ADMIN',
        isPublic: true
      }
    });

    console.log('Admin user created:', adminUser.email);
    
    // Create some test users
    const testUsers = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('password123', 10),
        location: 'New York',
        availability: ['Weekends', 'Evenings'],
        isPublic: true
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: await bcrypt.hash('password123', 10),
        location: 'Los Angeles',
        availability: ['Weekdays', 'Mornings'],
        isPublic: true
      }
    ];

    for (const userData of testUsers) {
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: userData
      });
      console.log('Test user created:', user.email);
    }

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Seed error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed(); 