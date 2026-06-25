import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || '';
    const q = searchParams.get('q') || '';

    let query = 'SELECT * FROM products';
    let params = [];

    if (category && category !== 'All') {
      query += ' WHERE category = ?';
      params.push(category);
    } else if (q) {
      query += ' WHERE title LIKE ?';
      params.push(`%${q}%`);
    }

    const [rows] = await pool.execute(query, params);

    return NextResponse.json({
      success: true,
      products: rows,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, error: 'Database error' },
      { status: 500 }
    );
  }
}