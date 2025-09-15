import Link from "next/link";

const categories = [
  { key: "hospitals", label: "Hospitals & Clinics" },
  { key: "restaurants", label: "Restaurants" },
  { key: "hotels", label: "Hotels" },
  { key: "repairs", label: "Repairs" },
  { key: "fitness", label: "Fitness Centers" },
] as const;

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-12 sm:px-10">
      <section className="max-w-5xl mx-auto text-center">
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight">Smart City Connect</h1>
        <p className="text-base sm:text-lg text-black/70 dark:text-white/70 mt-3">
          Discover hospitals, restaurants, hotels, repair services, and fitness centers around you.
        </p>
      </section>

      <section className="max-w-5xl mx-auto mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((c) => (
          <Link
            key={c.key}
            href={`/${c.key}`}
            className="rounded-xl border border-black/10 dark:border-white/10 p-5 hover:bg-black/[.03] dark:hover:bg-white/[.06] transition"
          >
            <h3 className="text-lg font-medium">{c.label}</h3>
            <p className="text-sm text-black/65 dark:text-white/65 mt-1">Browse nearby {c.label.toLowerCase()}.</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
