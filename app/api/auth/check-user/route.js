import { NextResponse } from "next/server";
import db from "../../../../lib/db";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ exists: false }, { status: 400 });
    }

    // Query both email and mobile fields
    const [users] = await db.query(
      "SELECT id FROM users WHERE email = ? OR mobile = ?",
      [email, email]
    );

    return NextResponse.json({ exists: users.length > 0 });
  } catch (error) {
    console.error("Check-user error:", error);
    return NextResponse.json({ exists: false }, { status: 500 });
  }
}
