'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Bookmark } from 'lucide-react'; // Import the Bookmark icon

interface Bookmark {
  _id: string;
  itemId: string;
  itemType: 'anime' | 'manga' | 'novel';
}

interface ItemDetails {
  mal_id: number;
  title: string;
  score: number;
  type: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
  volumes?: number; // For light novels
  status?: string; // For light novels
  chapters?: number; // For light novels
}

const BookmarksPage = () => {
  const { data: session } = useSession();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [itemDetails, setItemDetails] = useState<{ [key: string]: ItemDetails }>({});
  const [error, setError] = useState<string | null>(null);

  // Fetch bookmarks from the API
  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!session?.user?.id) return;

      try {
        const response = await fetch(`/api/bookmarks?userId=${session.user.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch bookmarks');
        }
        const data = await response.json();
        setBookmarks(data);

        // Fetch details for each bookmark from Jikan API
        const details: { [key: string]: ItemDetails } = {};
        for (const bookmark of data) {
          const detailsData = await fetchItemDetails(bookmark.itemType, bookmark.itemId);
          if (detailsData) {
            details[bookmark._id] = detailsData;
          }
        }
        setItemDetails(details);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
        setError('Failed to load bookmarks. Please try again later.');
      }
    };

    fetchBookmarks();
  }, [session]);

  // Fetch item details from Jikan API
  const fetchItemDetails = async (itemType: string, itemId: string) => {
    try {
      // Light novels are fetched from the 'manga' endpoint
      const endpoint = itemType === 'novel' ? 'manga' : itemType;
      const response = await fetch(`https://api.jikan.moe/v4/${endpoint}/${itemId}`);
      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`Resource not found for ${itemType} ID ${itemId}`);
          return null;
        }
        throw new Error(`Failed to fetch item details: ${response.statusText}`);
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching item details:', error);
      return null;
    }
  };

  // Delete a bookmark
  const deleteBookmark = async (bookmarkId: string) => {
    try {
      const response = await fetch(`/api/bookmarks/${bookmarkId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete bookmark');
      }
      // Remove the deleted bookmark from the state
      setBookmarks((prev) => prev.filter((bookmark) => bookmark._id !== bookmarkId));
    } catch (error) {
      console.error('Error deleting bookmark:', error);
    }
  };

  // Toggle bookmark status
  const toggleBookmark = async (bookmarkId: string, itemId: string, itemType: string) => {
    const isBookmarked = bookmarks.some((bookmark) => bookmark.itemId === itemId);
    if (isBookmarked) {
      await deleteBookmark(bookmarkId);
    } else {
      await addBookmark(itemId, itemType);
    }
  };

  // Add a bookmark
  const addBookmark = async (itemId: string, itemType: string) => {
    try {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, itemType }),
      });

      if (!response.ok) {
        throw new Error('Failed to bookmark');
      }

      const newBookmark = await response.json();
      setBookmarks((prev) => [...prev, newBookmark]);
    } catch (error) {
      console.error('Error bookmarking:', error);
    }
  };

  if (!session || !session.user) {
    return <p>Please log in to view your bookmarks.</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-900 py-24">
      <h1 className="text-2xl font-bold text-white mb-6">Your Bookmarks</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {bookmarks.map((bookmark) => {
          const details = itemDetails[bookmark._id];
          const isBookmarked = bookmarks.some((b) => b.itemId === bookmark.itemId);

          return (
            <motion.div
              key={bookmark._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="flex-none w-full"
            >
              {/* Use the correct endpoint for light novels */}
              <Link href={`/${bookmark.itemType === 'novel' ? 'manga' : bookmark.itemType}/${bookmark.itemId}`}>
                <Card className="relative group overflow-hidden bg-gray-800 border-0">
                  <div className="relative aspect-[2/3]">
                    {details?.images?.jpg?.image_url && (
                      <Image
                        width={300}
                        height={500}
                        src={details.images.jpg.image_url}
                        alt={details.title || 'Bookmark'}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 p-2 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {details?.score && (
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-semibold text-white">Score: {details.score}</span>
                        </div>
                      )}
                      {details?.volumes && (
                        <p className="text-sm text-white">Volumes: {details.volumes}</p>
                      )}
                      {details?.status && (
                        <p className="text-sm text-white">Status: {details.status}</p>
                      )}
                      {details?.chapters && (
                        <p className="text-sm text-white">Chapters: {details.chapters}</p>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white line-clamp-2">
                      {details?.title || `Bookmark ${bookmark.itemId}`}
                    </h3>
                    {/* Bookmark Icon */}
                    <motion.div
                      whileHover={{ scale: 0.9 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.preventDefault(); // Prevent navigation
                        toggleBookmark(bookmark._id, bookmark.itemId, bookmark.itemType);
                      }}
                      className="cursor-pointer"
                    >
                      <Bookmark
                        className="h-6 w-6 text-white"
                        fill={isBookmarked ? 'currentColor' : 'none'}
                      />
                    </motion.div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default BookmarksPage;