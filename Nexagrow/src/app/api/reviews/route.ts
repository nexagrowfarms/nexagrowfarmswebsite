import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Review from '@/models/Review';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    const productId = req.nextUrl.searchParams.get('productId');
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ message: 'productId is required' }, { status: 400 });
    }

    await connectDB();

    const reviews = await Review.find({ productId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      reviews.map((r) => ({
        _id: r._id,
        userName: r.userName,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
      })),
      { status: 200 }
    );
  } catch (err) {
    console.error('[Reviews] GET error', err);
    return NextResponse.json({ message: 'Failed to load reviews' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { productId, comment, rating } = body as {
      productId?: string;
      comment?: string;
      rating?: number;
    };

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ message: 'Valid productId is required' }, { status: 400 });
    }
    if (!comment || typeof comment !== 'string' || !comment.trim()) {
      return NextResponse.json({ message: 'Comment is required' }, { status: 400 });
    }

    await connectDB();

    const review = await Review.create({
      productId,
      userId: session.user.id,
      userName: session.user.name || session.user.email || 'Customer',
      rating: typeof rating === 'number' ? rating : undefined,
      comment: comment.trim(),
    });

    return NextResponse.json(
      {
        _id: review._id,
        userName: review.userName,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[Reviews] POST error', err);
    return NextResponse.json({ message: 'Failed to submit review' }, { status: 500 });
  }
}

