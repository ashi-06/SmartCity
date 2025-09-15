"use client";
import ServiceBrowser from "@/components/ServiceBrowser";

export default function HospitalsPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl sm:text-3xl font-semibold">Hospitals & Clinics</h1>
      <ServiceBrowser category="hospitals" />
    </main>
  );
}

