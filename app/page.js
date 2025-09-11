import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans min-h-screen p-8 sm:p-20 flex flex-col gap-12">
      {/* Header */}
      <header className="flex flex-col items-center sm:items-start gap-4">
        <h1 className="text-2xl font-bold">Realtime Orders Dashboard</h1>
        <p className="text-gray-700 dark:text-gray-300 max-w-2xl text-center sm:text-left">
          This project demonstrates a system where clients automatically receive
          updates whenever data in the database changes, without relying on
          frequent polling.
        </p>
      </header>

      {/* Problem Statement */}
      <section className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 shadow-md max-w-4xl">
        <h2 className="text-xl font-semibold mb-4">Problem Statement</h2>
        <p className="mb-2">
          You are required to design and implement a system where clients
          automatically receive updates whenever data in the database changes.
          The system should not rely on frequent polling from clients.
        </p>
        <h3 className="font-semibold mt-4">Requirements:</h3>
        <ul className="list-disc ml-6 mt-2 space-y-1">
          <li>
            Database Changes – A table called <code>orders</code> with fields:
            <code>id, customer_name, product_name, status, updated_at</code>.
          </li>
          <li>
            Client Updates – Any insert/update/delete on this table should
            notify connected clients in real-time.
          </li>
          <li>
            Tech Choices – Backend: Node.js, Frontend: Next.js, Database:
            Postgres (Supabase Realtime).
          </li>
          <li>
            Deliverables – Working backend, simple client UI, and documentation.
          </li>
        </ul>
      </section>

      {/* Navigation Links */}
      <section className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        <Link
          href="/orders"
          className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition"
        >
          View Orders Table
        </Link>
        <Link
          href="/user"
          className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition"
        >
          User Dashboard (Update Orders)
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 mt-auto">
        &copy; 2025 Realtime Orders Dashboard. All rights reserved.
      </footer>
    </div>
  );
}
