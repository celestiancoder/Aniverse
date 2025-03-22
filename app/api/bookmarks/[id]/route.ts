import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/api/db';
import { User } from '@/app/api/models/User';
import { auth } from '../../auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const resolvedParams = await params;
  const bookmarkId = resolvedParams.id;
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