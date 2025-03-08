'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';

interface BookmarkButtonProps {
  itemId: string;
  itemType: string;
}

const BookmarkButton = ({ itemId, itemType }: BookmarkButtonProps) => {
  const { data: session } = useSession();
  const [isBookmarked, setIsBookmarked] = useState(false);

  if (!session || !session.user) {
    return <p>Please log in to bookmark this item.</p>;
  }

  // TypeScript now knows session.user exists in this scope
  const userId = session.user.id;

  const handleBookmark = async () => {
    // Using the extracted userId instead of directly accessing session.user.id
    const response = await fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, itemId, itemType }),
    });

    if (response.ok) {
      setIsBookmarked(true);
    }
  };

  return (
    <button onClick={handleBookmark} className="bg-blue-500 px-4 py-2 rounded-lg">
      {isBookmarked ? 'Bookmarked' : 'Bookmark'}
    </button>
  );
};

export default BookmarkButton;