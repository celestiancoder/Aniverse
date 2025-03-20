// route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/app/api/auth/[...nextauth]/db';
import { User } from '@/app/api/auth/[...nextauth]/models/User';
import { auth } from '@/app/api/auth/[...nextauth]/auth';

interface Bookmark {
  _id: string;
  itemId: string;
  itemType: string;
}

export async function GET() {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  try {
    const user = await User.findById(session.user.id).select('bookmarks');
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user.bookmarks);
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { itemId, itemType } = await request.json();
  if (!itemId || !itemType) {
    return NextResponse.json(
      { message: 'itemId and itemType are required' },
      { status: 400 }
    );
  }

  await connectDB();

  try {
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Check if the bookmark already exists
    const existingBookmark = user.bookmarks.find(
      (bookmark: Bookmark) => bookmark.itemId === itemId && bookmark.itemType === itemType
    );
    if (existingBookmark) {
      return NextResponse.json({ message: 'Bookmark already exists' }, { status: 400 });
    }

    user.bookmarks.push({ itemId, itemType });
    await user.save();
    return NextResponse.json({ message: 'Bookmark added successfully' });
  } catch (error) {
    console.error('Error adding bookmark:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}