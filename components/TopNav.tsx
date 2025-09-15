import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function TopNav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-black/10 dark:border-white/10">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold">Smart City Connect</Link>
        <nav className="hidden sm:flex gap-6 text-sm">
          <Link href="/">Home</Link>
          <Link href="/services">Services</Link>
          <Link href="/weather">Weather</Link>
          <Link href="/sos">SOS</Link>
          <Link href="/dashboard">Dashboard</Link>
        </nav>
        <div className="ml-4"><ThemeToggle /></div>
      </div>
    </header>
  );
}


