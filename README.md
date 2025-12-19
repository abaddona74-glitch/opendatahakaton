# OpenData Hakaton

A Next.js project with integrated frontend and backend capabilities, using Vercel Postgres as the database.

## Features

- **Frontend**: Modern React-based UI with Next.js 16 and Tailwind CSS
- **Backend**: API routes for server-side logic
- **Database**: Vercel Postgres integration
- **TypeScript**: Full type safety across the application
- **App Router**: Using Next.js App Router for better performance

## Tech Stack

- [Next.js 16](https://nextjs.org) - React framework for production
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) - Serverless SQL database

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager
- A Vercel account (for database deployment)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/abaddona74-glitch/opendatahakaton.git
cd opendatahakaton
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:

Copy the `.env.example` file to `.env.local`:
```bash
cp .env.example .env.local
```

4. Configure Vercel Postgres:

   - Go to your [Vercel Dashboard](https://vercel.com/dashboard)
   - Create a new Postgres database or use an existing one
   - Copy the environment variables from Vercel to your `.env.local` file

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Database Setup

Once your database is configured, initialize it by visiting:
```
http://localhost:3000/api/init
```

This will create the necessary tables in your database.

## Project Structure

```
opendatahakaton/
├── src/
│   ├── app/              # Next.js app router pages and layouts
│   │   ├── api/          # API routes (backend)
│   │   │   ├── init/     # Database initialization endpoint
│   │   │   └── users/    # User CRUD endpoints
│   │   ├── page.tsx      # Homepage (frontend)
│   │   └── layout.tsx    # Root layout
│   └── lib/              # Utility functions and configurations
│       └── db.ts         # Database helper functions
├── public/               # Static assets
├── .env.example          # Environment variables template
└── package.json          # Dependencies and scripts
```

## API Endpoints

### Initialize Database
- **GET** `/api/init` - Create database tables

### Users
- **GET** `/api/users` - Fetch all users
- **POST** `/api/users` - Create a new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com"
  }
  ```

## Environment Variables

The following environment variables are required (automatically set by Vercel):

```
POSTGRES_URL
POSTGRES_PRISMA_URL
POSTGRES_URL_NON_POOLING
POSTGRES_USER
POSTGRES_HOST
POSTGRES_PASSWORD
POSTGRES_DATABASE
```

See `.env.example` for the complete list.

## Building for Production

```bash
npm run build
npm run start
```

## Linting

```bash
npm run lint
```

## Deploy on Vercel

The easiest way to deploy this application is using the [Vercel Platform](https://vercel.com):

1. Push your code to GitHub
2. Import your repository to Vercel
3. Add a Vercel Postgres database to your project
4. Environment variables will be automatically configured
5. Deploy!

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Vercel Postgres Documentation](https://vercel.com/docs/storage/vercel-postgres) - Database documentation
- [Next.js GitHub repository](https://github.com/vercel/next.js)

## License

This project is open source and available under the MIT License.
