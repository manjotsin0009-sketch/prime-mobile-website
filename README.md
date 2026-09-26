# PRIME MOBILE

A premium gaming community website built with React + TypeScript + Vite and designed for Supabase integration.

## Features included
- Premium homepage with dark gaming aesthetic
- Download game CTA linking to the provided MediaFire APK
- Discord CTA linking to the provided invite
- Complaint submission form with category selection, evidence upload, and ID generation
- Private complaint messaging and admin review flow
- Separate private admin chat
- Auth flow with admin/user role switching
- Mobile responsive layout
- Loading and validation states
- Supabase-ready configuration and SQL schema

## Local development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the project root using `.env.example` as the template.
3. Fill in your Supabase values:
   ```bash
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Start the dev server:
   ```bash
   npm run dev -- --host 0.0.0.0
   ```
5. Open the local URL shown in the terminal.

## Supabase setup
1. Create a Supabase project.
2. Run the SQL from `supabase/schema.sql` in the SQL editor.
3. Enable Authentication and Email/Password sign-in.
4. Configure Row Level Security policies through the provided SQL.
5. Add the project URL and anon key to `.env`.

## GitHub deployment
1. Push this project to a GitHub repository.
2. On Vercel or Netlify, import the repository.
3. Set environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy.

## Security notes
- Keep the Supabase `anon` key public and do not expose secrets.
- Use service role keys only in server-side code.
- Keep all complaint, message, and evidence data behind RLS policies.
- Use role-based authorization for admin-only routes and actions.

## Important
This version includes a secure frontend architecture and a Supabase schema, while also providing a ready demo-mode fallback so the project works before backend credentials are configured.
