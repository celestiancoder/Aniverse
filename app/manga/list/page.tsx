'use client';

import { useState, useEffect, useCallback } from 'react'; // Add useCallback
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import axios from 'axios';
import Link from 'next/link';
import LoadingSpinner from '../loading';

interface Manga {
  mal_id: number;
  title: string;
  score: number;
  type: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
  status: string;
}

export default function MangaListPage() {
  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  // Wrap fetchMoreManga in useCallback
  const fetchMoreManga = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await axios.get(
        `https://api.jikan.moe/v4/top/manga?page=${page}`
      );

      if (!response.data || !response.data.data) {
        throw new Error('Invalid API response');
      }

      const newManga = response.data.data.map((manga: Manga) => ({
        mal_id: manga.mal_id,
        title: manga.title,
        score: manga.score,
        type: manga.type,
        images: manga.images,
        status: manga.status,
      }));

      if (newManga.length > 0) {
        setMangaList((prev) => [...prev, ...newManga]);
        setPage((prev) => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching more manga:', error);
    } finally {
      setLoading(false);
    }
  }, [page]); // Add `page` as a dependency

  useEffect(() => {
    if (inView && !loading && hasMore) {
      fetchMoreManga();
    }
  }, [inView, fetchMoreManga, hasMore, loading]); // Add `fetchMoreManga` to the dependency array

  return (
    <div>
      <div className="min-h-screen p-8 bg-gray-900 px-80">
        <h1 className="text-3xl font-bold mb-8 text-white p-8">Manga Collection</h1>
        {mangaList.length === 0 && !loading ? (
          <p className="text-center text-gray-400">No manga found.</p>
        ) : (
          <div className="space-y-6">
            {mangaList.map((manga) => (
              <Link href={`/manga/${manga.mal_id}`} key={manga.mal_id}>
                <motion.div
                  className="flex items-center space-x-4 bg-gray-800 p-4 rounded-lg cursor-pointer transform transition-all duration-300"
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: 'rgba(75, 85, 99, 1)',
                  }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut"
                  }}
                >
                  <div className="relative w-24 h-32 overflow-hidden rounded-md">
                    <motion.img
                      src={manga.images.jpg.image_url}
                      alt={manga.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-white">{manga.title}</h2>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <p className="text-sm text-gray-400">
                        Rating: {manga.score || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-400">
                        Status: {manga.status}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}

        <div ref={ref} className="py-6">
          {loading && (
            <div className="text-center">
              <LoadingSpinner></LoadingSpinner>
            </div>
          )}
          {!hasMore && (
            <p className="text-center text-gray-400">You have reached the end of the list.</p>
          )}
        </div>
      </div>
    </div>
  );
}