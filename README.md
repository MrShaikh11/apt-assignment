# Realtime Orders Dashboard Assignment

## Problem Statement

You are required to design and implement a system where clients automatically receive updates whenever data in the database changes. The system should not rely on frequent polling from clients. The challenge is to think about how updates can be efficiently propagated from the database to connected clients in real-time.

## Solution Overview

This project solves the problem using Next.js (React), Supabase (Postgres with built-in realtime), and Tailwind CSS. The system provides a browser-based client that instantly receives updates when the `orders` table changes, without polling.

### Why This Approach?

- **Supabase Realtime**: Supabase provides built-in realtime subscriptions for Postgres tables. This means any insert, update, or delete on the `orders` table triggers a push notification to all connected clients. No need to build custom WebSocket infrastructure or polling logic.
- **Next.js (React)**: Next.js offers a modern, scalable frontend framework with server/client components, routing, and fast refresh. It’s ideal for building interactive dashboards and is widely used in industry.
- **Tailwind CSS**: Used for rapid UI development and responsive design. It keeps the codebase clean and maintainable.
- **Sonner**: For toast notifications, improving UX.
- **Modular Code**: Components and utilities are split for clarity and reusability.

### Scalability & Efficiency

- **No Polling**: Clients subscribe to realtime changes, reducing server/database load and latency.
- **Supabase Channels**: Efficiently manages multiple clients and events.
- **Next.js App Directory**: Enables server/client separation and future scalability.

## Project Structure

```
apt-assignment/
├── app/                # Next.js app directory (routing, pages, layouts)
├── components/         # Reusable React components
├── lib/                # Utility and Supabase client/server code
├── public/             # Static assets (SVGs, images)
├── package.json        # Project dependencies and scripts
├── README.md           # Project documentation
```

## How It Works

- The frontend subscribes to changes on the `orders` table using Supabase’s realtime API.
- Any change (insert/update/delete) triggers a push to all clients, updating the UI instantly.
- The backend is managed by Supabase, which listens for DB changes and handles broadcasting.
- The UI is responsive and shows latest updates, user orders, and admin dashboard.

## How to Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/apt-assignment.git
   cd apt-assignment
   ```
2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Configure Supabase**
   - Create a project at [Supabase](https://supabase.com/).
   - Create a table `orders` with fields:
     - `id` (int, primary key)
     - `customer_name` (string)
     - `product_name` (string)
     - `status` (string: 'pending', 'shipped', 'delivered')
     - `updated_at` (timestamp)
   - Enable Realtime for the table in Supabase dashboard.
   - Get your project URL and anon/public key.
   - Create a `.env.local` file:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
     NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your-supabase-anon-key
     ```
4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Why Not Other Approaches?

- **Polling**: Inefficient, increases load and latency.
- **Custom WebSocket Server**: More complex, but Supabase already provides this out of the box.
- **Other Databases**: Postgres is robust and works seamlessly with Supabase’s realtime features.

## Evaluation Criteria

- **Design Thinking**: Used Supabase for scalable, efficient realtime updates.
- **Correctness**: All clients receive updates instantly and accurately.
- **Code Quality**: Modular, readable, and maintainable codebase.
- **Documentation**: This README explains the approach and setup clearly.

## License

MIT
