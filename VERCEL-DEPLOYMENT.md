# Deploying to Vercel

This guide will walk you through deploying your EdTech platform to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup) (you can sign up with GitHub)
2. Your project code pushed to a GitHub repository
3. Access to set up environment variables

## Steps to Deploy

### 1. Prepare Your Database

Since you're using Prisma with SQLite, you'll need to switch to a production database like PostgreSQL. Vercel doesn't support SQLite for production deployments because it requires persistent file storage.

1. Create a PostgreSQL database using [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) or another provider like:
   - [Supabase](https://supabase.com/)
   - [Railway](https://railway.app/)
   - [Neon](https://neon.tech/)

2. Once you have your database URL, keep it handy for the next steps.

### 2. Verify Dependency Compatibility

The project has been configured with compatible versions of React Three Fiber and related packages that work with React 18. If you've modified dependencies, ensure that all packages are compatible to prevent build failures.

Important compatibility notes:
- `@react-three/drei` version 9.x is compatible with React 18
- `@react-three/fiber` version 8.x is compatible with React 18
- `three` version 0.159.0 works well with the above packages

### 3. Connect Your Repository to Vercel

1. Log in to your Vercel account
2. Click "Add New..." and select "Project"
3. Import your GitHub repository
4. Configure the project settings:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: .next

### 4. Configure Environment Variables

Add the following environment variables in the Vercel project settings:

| Name | Value | Description |
|------|-------|-------------|
| `DATABASE_URL` | `postgresql://...` | Your PostgreSQL connection string |
| `NEXTAUTH_SECRET` | `your-long-secure-string` | A secure random string for NextAuth |
| `GITHUB_ID` | `your-github-client-id` | GitHub OAuth App Client ID |
| `GITHUB_SECRET` | `your-github-client-secret` | GitHub OAuth App Client Secret |

### 5. Deploy Your Application

1. Click "Deploy" and wait for the build to complete
2. Vercel will automatically build and deploy your application

### 6. Set Up GitHub OAuth for Production

You need to update your GitHub OAuth app to work with your production URL:

1. Go to GitHub Developer Settings > OAuth Apps > Your App
2. Update the Homepage URL to your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
3. Update the Authorization callback URL to include the auth callback path: `https://your-app.vercel.app/api/auth/callback/github`

### 7. Set Up Database Schema

After the first deployment, you need to set up your database schema:

```bash
# Install Vercel CLI if you haven't already
npm install -g vercel

# Login to Vercel CLI
vercel login

# Pull environment variables locally
vercel env pull .env.local

# Generate Prisma client
npx prisma generate

# Push the schema to your production database
npx prisma db push

# Seed the database with initial data
npx prisma db seed
```

## Troubleshooting

If you encounter any issues:

1. **Build Errors**: Check the build logs in Vercel for specific error messages
2. **Database Connection Issues**: Ensure your DATABASE_URL is correct and the database is accessible from Vercel
3. **Authentication Problems**: Verify your OAuth settings and NEXTAUTH_SECRET are properly configured
4. **Environment Variables**: Make sure all required environment variables are set in Vercel
5. **Dependency Conflicts**: If you see errors related to dependency conflicts, check that your package versions are compatible with each other

## Continuous Deployment

Vercel will automatically deploy new versions when you push to your main branch. You can also configure:

1. Preview deployments for pull requests
2. Custom domains
3. Environment variables per deployment branch

For more detailed information, refer to the [Vercel Documentation](https://vercel.com/docs). 