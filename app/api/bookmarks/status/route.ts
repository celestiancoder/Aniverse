import { NextResponse } from 'next/server';
import connectDB from '@/app/api/auth/[...nextauth]/db';
import { User } from '@/app/api/auth/[...nextauth]/models/User';


interface Bookmark {
    _id: string;
    itemId: string;
    itemType: string;
  }


  
  export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const itemId = searchParams.get('itemId');
  
    if (!userId || !itemId) {
      return NextResponse.json(
        { message: 'userId and itemId are required' },
        { status: 400 }
      );
    }
  
    await connectDB();
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }
  
      const bookmark = user.bookmarks.find(
        (bookmark:Bookmark) => bookmark.itemId === itemId
      );
  
      return NextResponse.json({
        isBookmarked: !!bookmark,
        bookmarkId: bookmark?._id || null, // Return the bookmarkId if it exists
      });
    } catch (error) {
      console.error('Error fetching bookmark status:', error);
      return NextResponse.json(
        { message: 'Internal server error' },
        { status: 500 }
      );
    }
  }