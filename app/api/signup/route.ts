import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User, { UserRole } from "@/lib/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role } = body as { name: string; email: string; password: string; role: UserRole };
    if (!name || !email || !password) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    if (role && !["resident", "tourist", "superadmin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
    await connectToDatabase();
    const exists = await User.findOne({ email }).lean();
    if (exists) return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    const passwordHash = await bcrypt.hash(password, 10);
    const doc = await User.create({ name, email, passwordHash, role: role || "resident" });
    return NextResponse.json({ id: String(doc._id) }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Unknown error" }, { status: 500 });
  }
}


