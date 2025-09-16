import Link from "next/link";

const categories = [
  { key: "hospitals", label: "Hospitals & Clinics" },
  { key: "restaurants", label: "Restaurants" },
  { key: "hotels", label: "Hotels" },
  { key: "repairs", label: "Repairs" },
  { key: "fitness", label: "Fitness Centers" },
] as const;

export default function ServicesPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl sm:text-3xl font-semibold">Services</h1>
      <p className="mt-2 text-black/70 dark:text-white/70">Pick a category to browse nearby places.</p>

      <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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


