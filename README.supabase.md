# Supabase Setup for Chat Application

## Overview

This document provides instructions for setting up Supabase for the chat application. The application uses Supabase for:

- User authentication
- Real-time messaging
- Friend connections
- Online status tracking
- Typing indicators

## Setup Steps

### 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign up or log in
2. Create a new project
3. Note your project URL and anon key (public API key)

### 2. Configure Environment Variables

Create a `.env` file in the root of your project (copy from `.env.example`):

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_TEMPO=true
```

### 3. Set Up Database Schema

You can set up the database schema in two ways:

#### Option 1: Using the SQL Editor in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Create a new query
4. Copy and paste the contents of `supabase/migrations/20240311_initial_schema.sql`
5. Run the query

#### Option 2: Using Supabase CLI (Recommended for Development)

1. Install the Supabase CLI: `npm install -g supabase`
2. Login to Supabase: `supabase login`
3. Link your project: `supabase link --project-ref your-project-ref`
4. Push the migrations: `supabase db push`

### 4. Seed Test Data (Optional)

To add test data for development:

1. Go to the SQL Editor in your Supabase dashboard
2. Create a new query
3. Copy and paste the contents of `supabase/seed.sql`
4. Run the query

## Database Structure

The application uses the following tables:

- **users**: User profiles with online status
- **friends**: Friend connections between users
- **messages**: Chat messages between users
- **user_typing**: Typing indicators for real-time feedback

## Authentication

The application uses Supabase Auth with email/password authentication. When a user signs up:

1. An entry is created in the `auth.users` table (handled by Supabase)
2. A trigger automatically creates a corresponding entry in the `public.users` table

## Real-time Features

The application uses Supabase's real-time capabilities for:

- New message notifications
- Typing indicators
- Online status updates

These are implemented using Supabase's Realtime feature with Postgres changes.

## Row Level Security (RLS)

All tables have Row Level Security enabled to ensure users can only access data they're authorized to see:

- Users can only view their own messages
- Users can only update their own profile
- Users can only see friend connections they're part of

## Testing the Setup

After completing the setup:

1. Run the application: `npm run dev`
2. Create a new account or use the test accounts:
   - Email: user1@example.com, Password: password (if you've run the seed script)
3. Test the chat functionality
