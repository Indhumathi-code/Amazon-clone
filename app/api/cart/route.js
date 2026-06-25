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

    const { product_id, quantity } = await req.json();

    if (!product_id) {
      return NextResponse.json({ success: false, message: "Missing product_id" }, { status: 400 });
    }

    // Insert or update quantity if duplicate
    await db.query(
      `INSERT INTO cart (user_id, product_id, quantity) 
       VALUES (?, ?, ?) 
       ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
      [userId, product_id, quantity || 1]
    );

    return NextResponse.json({
      success: true,
      message: "Item added to cart",
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    return NextResponse.json({ success: false, message: "Server error, please try again" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const [cartItems] = await db.query(
      `SELECT c.*, p.title, p.price, p.original_price, p.image_url, p.category 
       FROM cart c 
       JOIN products p ON c.product_id = p.id 
       WHERE c.user_id = ?`,
      [userId]
    );

    return NextResponse.json({
      success: true,
      cart: cartItems,
    });
  } catch (error) {
    console.error("Get cart items error:", error);
    return NextResponse.json({ success: false, message: "Server error, please try again" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("product_id");

    if (!productId) {
      return NextResponse.json({ success: false, message: "Missing product_id parameter" }, { status: 400 });
    }

    await db.query(
      "DELETE FROM cart WHERE user_id = ? AND product_id = ?",
      [userId, productId]
    );

    return NextResponse.json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (error) {
    console.error("Delete cart item error:", error);
    return NextResponse.json({ success: false, message: "Server error, please try again" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { product_id, quantity } = await req.json();

    if (!product_id || quantity === undefined) {
      return NextResponse.json({ success: false, message: "Missing product_id or quantity" }, { status: 400 });
    }

    await db.query(
      "UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?",
      [quantity, userId, product_id]
    );

    return NextResponse.json({
      success: true,
      message: "Cart item quantity updated",
    });
  } catch (error) {
    console.error("Update cart item error:", error);
    return NextResponse.json({ success: false, message: "Server error, please try again" }, { status: 500 });
  }
}
