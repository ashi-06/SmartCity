"use client";
import Link from "next/link";

export interface CategoryItem {
  key: string;
  label: string;
  href: string;
}

export function CategoryGrid({ items }: { items: CategoryItem[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {items.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className="rounded-xl border border-black/10 dark:border-white/10 p-5 hover:bg-black/[.03] dark:hover:bg-white/[.06] transition block"
        >
          <h3 className="text-lg font-medium">{item.label}</h3>
          <p className="text-sm text-black/65 dark:text-white/65 mt-1">Browse nearby {item.label.toLowerCase()}.</p>
        </Link>
      ))}
    </div>
  );
}

