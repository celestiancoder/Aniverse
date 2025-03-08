'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';

interface Bookmark {
  _id: string;
  itemId: string;
  itemType: string;
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
      const response = await fetch(`https://api.jikan.moe/v4/${itemType}/${itemId}`);
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
      setBookmarks((prev: Bookmark[]) => prev.filter((bookmark: Bookmark) => bookmark._id !== bookmarkId));
    } catch (error) {
      console.error('Error deleting bookmark:', error);
    }
  };

  if (!session || !session.user) {
    return <p>Please log in to view your bookmarks.</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-900">
      <h1 className="text-2xl font-bold text-white mb-6">Your Bookmarks</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookmarks.map((bookmark: Bookmark) => {
          const details = itemDetails[bookmark._id];
          return (
            <motion.div
              key={bookmark._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="flex-none w-full"
            >
              <Link href={`/${bookmark.itemType}/${bookmark.itemId}`}>
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
                      {details?.type && (
                        <p className="text-sm text-white line-clamp-2">{details.type}</p>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white line-clamp-2">
                      {details?.title || `Bookmark ${bookmark.itemId}`}
                    </h3>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="mt-2"
                      onClick={(e) => {
                        e.preventDefault(); // Prevent navigation
                        deleteBookmark(bookmark._id);
                      }}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
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