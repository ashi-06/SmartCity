"use client";
import { usePathname } from "next/navigation";
import TopNav from "./TopNav";

const HIDDEN = new Set(["/", "/login", "/signup"]);

export default function NavGate() {
  const pathname = usePathname();
  if (HIDDEN.has(pathname || "/")) return null;
  return <TopNav />;
}


