"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  return (
    <main className="max-w-sm mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold">Log in</h1>
      <div className="mt-6 space-y-3">
        <a className="w-full inline-block text-center rounded-md border px-3 py-2" href="/api/oauth/google/start">
          Continue with Google
        </a>
        <div className="text-xs opacity-70">Or create an account:</div>
        <Link href="/signup" className="w-full inline-block text-center rounded-md border px-3 py-2">
          Sign up
        </Link>
      </div>
    </main>
  );
}


