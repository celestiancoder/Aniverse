import { NextResponse } from 'next/server';
import connectDB from '@/app/api/auth/[...nextauth]/db';
import { User } from '@/app/api/auth/[...nextauth]/models/User';
import { auth } from '@/app/api/auth/[...nextauth]/auth';

// Next.js expects this format for route parameters
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  
  const bookmarkId = params.id;
  const userId = session.user.id;
  
  await connectDB();
  
  try {
    // Find the user and remove the bookmark by its ID
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { bookmarks: { _id: bookmarkId } } },
      { new: true }
    );
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Bookmark deleted successfully' });
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}