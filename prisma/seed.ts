import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Seeding the database...');
    
    // Create admin user
    const adminPassword = await hash('admin123', 12);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        name: 'Admin User',
        email: 'admin@example.com',
        password: adminPassword,
        role: 'ADMIN',
        emailVerified: new Date(),
      },
    });
    
    console.log(`Admin user created: ${admin.email}`);
    
    // Create a tutor user
    const tutorPassword = await hash('tutor123', 12);
    const tutor = await prisma.user.upsert({
      where: { email: 'tutor@example.com' },
      update: {},
      create: {
        name: 'Demo Tutor',
        email: 'tutor@example.com',
        password: tutorPassword,
        role: 'TUTOR',
        emailVerified: new Date(),
        bio: 'Experienced tutor with 5+ years teaching online.',
        expertise: 'Web Development, JavaScript, React',
      },
    });
    
    console.log(`Tutor user created: ${tutor.email}`);
    
    // Create a student user
    const studentPassword = await hash('student123', 12);
    const student = await prisma.user.upsert({
      where: { email: 'student@example.com' },
      update: {},
      create: {
        name: 'Demo Student',
        email: 'student@example.com',
        password: studentPassword,
        role: 'STUDENT',
        emailVerified: new Date(),
      },
    });
    
    console.log(`Student user created: ${student.email}`);
    
    // Create a sample course
    const course = await prisma.course.upsert({
      where: { id: 'clsample1' },
      update: {},
      create: {
        id: 'clsample1',
        title: 'Introduction to Web Development',
        description: 'Learn the fundamentals of web development from scratch.',
        longDescription: 'This comprehensive course covers HTML, CSS, and JavaScript basics to help you build your first website.',
        thumbnail: 'https://images.unsplash.com/photo-1546900703-cf06143d1239',
        price: 49.99,
        duration: '6 weeks',
        tutorId: tutor.id,
        tags: {
          create: [
            { name: 'Web Development' },
            { name: 'Beginner' },
            { name: 'HTML' },
            { name: 'CSS' },
          ]
        },
        chatSession: {
          create: {
            participants: {
              connect: [
                { id: tutor.id }
              ]
            }
          }
        }
      },
    });
    
    console.log(`Sample course created: ${course.title}`);
    
    // Add sample video to the course
    const video = await prisma.video.upsert({
      where: { id: 'vsample1' },
      update: {},
      create: {
        id: 'vsample1',
        title: 'Introduction to HTML',
        description: 'Learn the basic structure of HTML documents.',
        url: 'https://example.com/sample-video.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8',
        position: 0,
        courseId: course.id,
        transcript: {
          create: {
            content: 'Welcome to our first lesson on HTML. In this video, we will cover the basic structure of HTML documents...'
          }
        }
      },
    });
    
    console.log(`Sample video created: ${video.title}`);
    
    console.log('Database seeding completed successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 