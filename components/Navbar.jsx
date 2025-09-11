import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="w-full flex items-center justify-between px-4 py-2 border-b bg-white">
            {/* Logo/Home */}
            <Link href="/">
                <div className="flex items-center gap-2 cursor-pointer">
                    <span className="font-bold text-lg">APT </span>
                </div>
            </Link>
            <div className="flex items-center gap-6">
                <Link href="/user" className="text-sm font-medium hover:underline">User Page</Link>
                <Link href="/orders" className="text-sm font-medium hover:underline">Orders Page</Link>
            </div>
        </nav>
    );
}
