import { NextResponse } from "next/server";
import db from "../../../../lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ? OR mobile = ?",
      [email, email]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, message: "No account found with this email or mobile number" },
        { status: 404 }
      );
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Incorrect password" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET || 'amazon_clone_secret_key_123',
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      success: true,
      message: "Signed in successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Server error, please try again" },
      { status: 500 }
    );
  }
}