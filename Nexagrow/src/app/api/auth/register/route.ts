import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import User from '../../../../lib/User';

const SALT_ROUNDS = 12;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name } = body;
    console.log('[Register] Request body keys', { hasEmail: !!email, hasPassword: !!password, hasName: !!name });

    if (!email || typeof email !== 'string') {
      console.log('[Register] Validation failed: email required');
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }
    if (!password || typeof password !== 'string') {
      console.log('[Register] Validation failed: password required');
      return NextResponse.json({ message: 'Password is required' }, { status: 400 });
    }
    if (password.length < 8) {
      console.log('[Register] Validation failed: password too short');
      return NextResponse.json({ message: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      console.log('[Register] Validation failed: invalid email format');
      return NextResponse.json({ message: 'Invalid email address' }, { status: 400 });
    }

    await connectDB();
    console.log('[Register] DB connected, checking existing user');

    const existing = await User.findOne({ email: normalizedEmail }).lean();
    if (existing) {
      console.log('[Register] Email already exists');
      return NextResponse.json({ message: 'An account with this email already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    await User.create({
      email: normalizedEmail,
      password: hashedPassword,
      name: name?.trim() || normalizedEmail.split('@')[0],
      provider: 'credentials',
    });
    console.log('[Register] User created for', normalizedEmail);

    return NextResponse.json({ message: 'Account created. You can sign in now.' });
  } catch (e) {
    console.error('[Register] Error', e);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
