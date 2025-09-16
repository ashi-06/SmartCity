"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Role = "resident" | "tourist" | "superadmin";

export default function SignupPage() {
  const [role, setRole] = useState<Role>("resident");
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <main className="max-w-sm mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold">Sign up</h1>
      <form
        className="mt-6 space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          setSubmitting(true);
          const form = e.currentTarget as HTMLFormElement;
          const name = (form.elements.namedItem("name") as HTMLInputElement).value;
          const email = (form.elements.namedItem("email") as HTMLInputElement).value;
          const password = (form.elements.namedItem("password") as HTMLInputElement).value;
          try {
            const url = new URL("/api/signup", window.location.origin);
            const res = await fetch(url.toString(), {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name, email, password, role }),
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok) {
              setError(json.error || "Signup failed");
              setSubmitting(false);
              return;
            }
            router.push("/login");
          } catch (err: any) {
            setError(err?.message || "Network error");
            setSubmitting(false);
          }
        }}
      >
        <div>
          <label className="text-sm">Name</label>
          <input name="name" className="w-full rounded-md border border-black/15 dark:border-white/15 bg-transparent px-3 py-2" required />
        </div>
        <div>
          <label className="text-sm">Email</label>
          <input name="email" className="w-full rounded-md border border-black/15 dark:border-white/15 bg-transparent px-3 py-2" type="email" required />
        </div>
        <div>
          <label className="text-sm">Password</label>
          <input name="password" className="w-full rounded-md border border-black/15 dark:border-white/15 bg-transparent px-3 py-2" type="password" required />
        </div>

        <div>
          <label className="text-sm">Role</label>
          <select
            className="w-full rounded-md border border-black/15 dark:border-white/15 bg-transparent px-3 py-2"
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
          >
            <option value="resident">Resident</option>
            <option value="tourist">Tourist</option>
            <option value="superadmin">Super Admin</option>
          </select>
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}
        <button disabled={submitting} className="w-full rounded-md border px-3 py-2 disabled:opacity-60">
          {submitting ? "Creating..." : "Create account"}
        </button>
      </form>
    </main>
  );
}


