'use client';

import { useState, useEffect, useCallback } from 'react'; // Add useCallback
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import axios from 'axios';
import Link from 'next/link';
import LoadingSpinner from '../loading';

interface LightNovel {
  mal_id: number;
  title: string;
  score: number;
  type: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
  authors: Array<{
    name: string;
  }>;
  status: string;
}

export default function LightNovelListPage() {
  const [novelList, setNovelList] = useState<LightNovel[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  // Wrap fetchMoreNovels in useCallback
  const fetchMoreNovels = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await axios.get(
        `https://api.jikan.moe/v4/top/manga?page=${page}&type=lightnovel`
      );

      if (!response.data || !response.data.data) {
        throw new Error('Invalid API response');
      }

      const newNovels = response.data.data.map((novel: LightNovel) => ({
        mal_id: novel.mal_id,
        title: novel.title,
        score: novel.score,
        type: novel.type,
        images: novel.images,
        authors: novel.authors || [],
        status: novel.status,
      }));

      if (newNovels.length > 0) {
        setNovelList((prev) => [...prev, ...newNovels]);
        setPage((prev) => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching more light novels:', error);
    } finally {
      setLoading(false);
    }
  }, [page]); // Add `page` as a dependency

  useEffect(() => {
    if (inView && !loading && hasMore) {
      fetchMoreNovels();
    }
  }, [inView, fetchMoreNovels, hasMore, loading]); // Add `fetchMoreNovels` to the dependency array

  return (
    <div>
      <div className="min-h-screen p-8 bg-gray-900 ">
        <h1 className="text-3xl font-bold mb-8 text-white p-8">Light Novels Collection</h1>
        {novelList.length === 0 && !loading ? (
          <p className="text-center text-gray-400">No light novels found.</p>
        ) : (
          <div className="space-y-6">
            {novelList.map((novel) => (
              <Link href={`/novels/${novel.mal_id}`} key={novel.mal_id}>
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
                      src={novel.images.jpg.image_url}
                      alt={novel.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-white">{novel.title}</h2>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <p className="text-sm text-gray-400">
                        Rating: {novel.score || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-400">
                        Status: {novel.status}
                      </p>
                      <p className="text-sm text-gray-400 col-span-2">
                        Authors: {novel.authors.map(author => author.name).join(', ') || 'Unknown'}
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