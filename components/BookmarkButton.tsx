'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';

interface BookmarkButtonProps {
  itemId: string;
  itemType: string;
}

const BookmarkButton = ({ itemId, itemType }: BookmarkButtonProps) => {
  const { data: session } = useSession();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookmarkStatus = async () => {
      if (!session?.user?.id) return;

      try {
        const response = await fetch(`/api/bookmarks/status?userId=${session.user.id}&itemId=${itemId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch bookmark status');
        }
        const data = await response.json();
        setIsBookmarked(data.isBookmarked);
        setBookmarkId(data.bookmarkId || null); // Set the bookmarkId if it exists
      } catch (error) {
        console.error('Error fetching bookmark status:', error);
      }
    };

    fetchBookmarkStatus();
  }, [session, itemId]);

  if (!session || !session.user) {
    return <p>Please log in to bookmark this item.</p>;
  }

  const userId = session.user.id;

  const handleBookmark = async () => {
    try {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, itemId, itemType }),
      });

      if (!response.ok) {
        throw new Error('Failed to bookmark');
      }

      const newBookmark = await response.json();
      setIsBookmarked(true);
      setBookmarkId(newBookmark._id); // Set the new bookmarkId
    } catch (error) {
      console.error('Error bookmarking:', error);
    }
  };

  const handleRemoveBookmark = async () => {
    if (!bookmarkId) return; // Ensure bookmarkId is available

    try {
      const response = await fetch(`/api/bookmarks/${bookmarkId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove bookmark');
      }

      setIsBookmarked(false);
      setBookmarkId(null); // Reset the bookmarkId
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  const toggleBookmark = async () => {
    if (isBookmarked) {
      await handleRemoveBookmark();
    } else {
      await handleBookmark();
    }
  };

  return (
    <button
      onClick={toggleBookmark}
      className="p-2 hover:bg-gray-700 rounded-full transition-colors"
    >
      <Bookmark
        className="h-6 w-6 text-white"
        fill={isBookmarked ? 'currentColor' : 'none'}
      />
    </button>
  );
};

export default BookmarkButton;