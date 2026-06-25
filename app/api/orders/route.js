import { NextResponse } from "next/server";
import db from "../../../lib/db";
import jwt from "jsonwebtoken";

// Helper to authenticate user from token
function getUserIdFromRequest(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'amazon_clone_secret_key_123');
    return decoded.id;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

export async function POST(req) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { product_id, quantity, total_price, shipping_address, payment_method } = await req.json();

    if (!product_id || !total_price || !shipping_address || !payment_method) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const [result] = await db.query(
      "INSERT INTO orders (user_id, product_id, quantity, total_price, shipping_address, payment_method) VALUES (?, ?, ?, ?, ?, ?)",
      [userId, product_id, quantity || 1, total_price, shipping_address, payment_method]
    );

    // Automatically remove the item from the user's cart
    await db.query(
      "DELETE FROM cart WHERE user_id = ? AND product_id = ?",
      [userId, product_id]
    );

    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      orderId: result.insertId,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ success: false, message: "Server error, please try again" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const [orders] = await db.query(
      `SELECT o.*, p.title as product_title, p.image_url as product_image, p.price as product_price 
       FROM orders o 
       JOIN products p ON o.product_id = p.id 
       WHERE o.user_id = ? 
       ORDER BY o.created_at DESC`,
      [userId]
    );

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json({ success: false, message: "Server error, please try again" }, { status: 500 });
  }
}
