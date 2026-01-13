# PMO Project Management Application

A complete Project Management Office application with CRUD operations, search, and reporting features.

## Features

- ✅ Create, Read, Update, Delete projects
- ✅ Advanced search by keywords, status, priority
- ✅ Real-time project statistics
- ✅ Responsive web interface
- ✅ Free hosting on Render + Supabase

## Live Demo

Deploy your own instance in minutes!

## Setup Instructions

### 1. Database Setup (Supabase)
1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Run the SQL from `database.sql` in the SQL Editor
4. Get your database connection string from Settings → Database

### 2. Local Development
```bash
# Clone and setup
git clone [your-repo-url]
cd pmo-application

# Install dependencies
npm install

# Create .env file
echo "DATABASE_URL=your_supabase_connection_string" > .env
echo "PORT=3000" >> .env
echo "NODE_ENV=development" >> .env

# Start development server
npm run dev