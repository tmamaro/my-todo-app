# My Todo App

A modern, full-stack todo application built with Vue 3, Tailwind CSS, and Supabase.

## Tech Stack

- **Frontend**: Vue 3 (Composition API with `<script setup>`)
- **Build Tool**: Vite
- **State Management**: Pinia
- **Styling**: Tailwind CSS
- **Backend/Database**: Supabase (PostgreSQL + Authentication + Realtime)
- **Routing**: Vue Router

## Features

- ✅ User authentication (Email/Password + OAuth providers)
- ✅ Real-time task synchronization
- ✅ CRUD operations with optimistic updates
- ✅ Task notes and completion tracking
- ✅ Responsive design with Tailwind CSS
- ✅ Connection status monitoring
- ✅ Automatic reconnection handling

## Prerequisites

- Node.js 18+ and npm
- A Supabase account and project
- Docker (optional, for containerized deployment)

## Supabase Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be provisioned
3. Note your project URL and anon key from Settings > API

### 2. Database Schema

Run this SQL in your Supabase SQL Editor:

-- Create tasks table
CREATE TABLE tasks (
id BIGSERIAL PRIMARY KEY,
user_uuid UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
title TEXT NOT NULL,
notes TEXT DEFAULT '',
is_completed BOOLEAN DEFAULT FALSE,
due_date TIMESTAMPTZ,
priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
category TEXT DEFAULT '',
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for user queries
CREATE INDEX idx_tasks_user_uuid ON tasks(user_uuid);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own tasks
CREATE POLICY "Users can view their own tasks"
ON tasks FOR SELECT
USING (auth.uid() = user_uuid);

CREATE POLICY "Users can insert their own tasks"
ON tasks FOR INSERT
WITH CHECK (auth.uid() = user_uuid);

CREATE POLICY "Users can update their own tasks"
ON tasks FOR UPDATE
USING (auth.uid() = user_uuid);

CREATE POLICY "Users can delete their own tasks"
ON tasks FOR DELETE
USING (auth.uid() = user_uuid);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;


### 3. Authentication Setup

1. Enable authentication providers in Supabase Dashboard:
   - Go to Authentication > Providers
   - Enable Email provider
   - (Optional) Configure OAuth providers (Google, GitHub, etc.)

2. Configure email templates:
   - Go to Authentication > Email Templates
   - Customize confirmation and reset password emails

## Local Development Setup

### 1. Clone the Repository

git clone https://github.com/tmamaro/my-todo-app.git
cd my-todo-app


### 2. Configure Environment Variables

Copy the example env file
cp frontend/.env.example frontend/.env

Edit `frontend/.env` with your Supabase credentials:

VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key


### 3. Install Dependencies

cd frontend
npm install

### 4. Run Development Server

npm run dev

The app will be available at `http://localhost:5173`

## Docker Deployment

### Using Docker Compose

Create .env file with your Supabase credentials
cp .env.example .env

Edit .env with your values
Then start the container
docker-compose up -d


### Manual Docker Build

cd frontend
docker build -t my-todo-app .
docker run -p 5173:5173
-e VITE_SUPABASE_URL=your-url
-e VITE_SUPABASE_ANON_KEY=your-key
my-todo-app


## Project Structure

my-todo-app/
├── frontend/
│ ├── src/
│ │ ├── components/ # Vue components
│ │ │ ├── TaskInput.vue
│ │ │ ├── TaskList.vue
│ │ │ ├── TaskTable.vue
│ │ │ ├── Login.vue
│ │ │ ├── Signup.vue
│ │ │ └── Layout.vue
│ │ ├── store/ # Pinia stores
│ │ │ ├── authStore.js
│ │ │ └── task.js
│ │ ├── router/ # Vue Router
│ │ │ └── index.js
│ │ ├── utils/ # Utility functions
│ │ ├── supabaseClient.js
│ │ ├── App.vue
│ │ └── main.js
│ ├── public/
│ ├── package.json
│ ├── vite.config.js
│ ├── tailwind.config.js
│ └── .env.example
├── docker-compose.yml
├── .env.example
└── README.md


## Key Features Explained

### Real-time Synchronization

The app uses Supabase Realtime with a dual-channel approach:
- **Insert/Update Channel**: User-filtered updates
- **Delete Channel**: Handles deletions with client-side filtering

### Optimistic Updates

All mutations use optimistic updates with automatic rollback on failure:
1. Update UI immediately
2. Send request to Supabase
3. Rollback if error occurs

### Connection Resilience

- Automatic reconnection with exponential backoff
- Visual connection status indicator
- Queue-based update processing

## Building for Production

cd frontend
npm run build


The built files will be in `frontend/dist/`

## Security Considerations

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Environment variables for credentials
- ✅ Supabase anon key is safe for client-side use
- ⚠️ Ensure RLS policies are properly configured
- ⚠️ Never commit `.env` files to version control

## Troubleshooting

### "Missing Supabase environment variables" Error

Ensure your `.env` file exists and contains valid credentials:

cd frontend
cat .env # Should show VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY


### Real-time Not Working

1. Check that Realtime is enabled for the `tasks` table in Supabase
2. Verify RLS policies allow your user to select/update/delete
3. Check browser console for WebSocket connection errors

### Authentication Issues

1. Verify email provider is enabled in Supabase Dashboard
2. Check email templates are configured
3. For OAuth: Ensure redirect URLs are configured

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: [tmamaro/my-todo-app/issues](https://github.com/tmamaro/my-todo-app/issues)
- Supabase Docs: [supabase.com/docs](https://supabase.com/docs)
