# Joshi LMS

Joshi LMS is a portfolio-ready Learning Management System that helps learners discover courses, save a personal learning path, track progress, and send persistent enquiries.

## Why this project exists

This project is designed as a polished full-stack product rather than a collection of classroom exercises. It focuses on a clear learning experience, strong responsive UI, practical state management, and deployable server-side features.

## Key features

- Course catalogue with keyword search and category filtering
- Detailed learning paths and outcome-focused course information
- Browser-persistent saved courses and progress tracking
- JSON import and export for a learner's personal plan
- Responsive dashboard-style interface for mobile, tablet, and desktop
- Accessible form feedback and clear empty/success/error states
- Server-rendered course data with Next.js App Router
- Validated enquiry API route that stores messages in MongoDB

## Built with

- Next.js App Router
- TypeScript and React
- MongoDB and Mongoose
- Tailwind CSS
- Vercel deployment

## Run locally

1. Install dependencies with `npm install`.
2. Create `.env.local` and add a MongoDB connection string:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   ```

3. Start the app with `npm run dev`.
4. Open `http://localhost:3000`.

## Deploy to Vercel

Import the repository in Vercel, then add `MONGODB_URI` under Project Settings → Environment Variables for Production and Preview. Every push to the selected GitHub branch will trigger a new deployment.

## Resume description

Built a full-stack Learning Management System using Next.js, TypeScript, MongoDB, and Vercel. Implemented a responsive course discovery experience, personal progress tracking with JSON import/export, server-side rendering, API validation, and persistent enquiry storage.
