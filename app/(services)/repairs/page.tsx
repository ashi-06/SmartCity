"use client";
import ServiceBrowser from "@/components/ServiceBrowser";

export default function RepairsPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl sm:text-3xl font-semibold">Repairs</h1>
      <ServiceBrowser category="repairs" />
    </main>
  );
}

