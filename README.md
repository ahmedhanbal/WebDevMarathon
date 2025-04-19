# EdTech Platform

A modern educational technology platform built with Next.js, featuring courses, video lessons, user authentication, and an interactive 3D classroom scene.

## Features

- **User Authentication**: Email/password and GitHub OAuth authentication
- **Role-Based Access**: Student, Tutor, and Admin roles with appropriate permissions
- **Course Management**: Create, edit, and manage online courses
- **Video Lessons**: Upload and organize video content with transcripts
- **Student Progress Tracking**: Track completion of videos and courses
- **Interactive 3D Classroom**: Engaging 3D visualization using React Three Fiber
- **Chat System**: Course-specific chat sessions for students and tutors
- **Payment Integration**: Course enrollment with payment processing

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Radix UI
- **3D Rendering**: Three.js, React Three Fiber, React Spring
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL (production), SQLite (development)
- **ORM**: Prisma
- **Payments**: Stripe
- **Real-time**: Socket.io

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/edtech-platform.git
cd edtech-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your environment values
```

4. Set up the database:
```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

See [VERCEL-DEPLOYMENT.md](VERCEL-DEPLOYMENT.md) for detailed instructions on deploying to Vercel.

## Demo Users

After seeding the database, you can log in with the following credentials:

- **Admin**: admin@example.com / admin123
- **Tutor**: tutor@example.com / tutor123
- **Student**: student@example.com / student123

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Prisma](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
