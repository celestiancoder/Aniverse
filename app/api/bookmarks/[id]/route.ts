import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User } from '@/models/User';
import { auth } from '@/auth';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    const { id } = params;
    const user = await User.findOneAndUpdate(
      { 'bookmarks._id': id },
      { $pull: { bookmarks: { _id: id } } },
      { new: true }
    );
    if (!user) {
      return NextResponse.json({ message: 'Bookmark not found' }, { status: 404 });
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
