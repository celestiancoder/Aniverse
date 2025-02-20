'use client';

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import axios from 'axios';
import Link from 'next/link';
import LoadingSpinner from '../loading';


interface Anime {
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

export default function AnimeListPage() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && !loading && hasMore) {
      fetchMoreAnime();
    }
  }, [inView,hasMore,loading]);

  const fetchMoreAnime = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await axios.get(`https://api.jikan.moe/v4/top/anime?page=${page}`);

      if (!response.data || !response.data.data) {
        throw new Error('Invalid API response');
      }

      const newAnime = response.data.data.map((anime: Anime) => ({
        mal_id: anime.mal_id,
        title: anime.title,
        score: anime.score,
        type: anime.type,
        images: anime.images,
      }));

      if (newAnime.length > 0) {
        setAnimeList((prev) => [...prev, ...newAnime]);
        setPage((prev) => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching more anime:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div>
    
      <div className="min-h-screen p-8 bg-gray-900 ">
        <h1 className="text-3xl font-bold mb-8 text-white p-8">Full List of Anime</h1>
        {animeList.length === 0 && !loading ? (
          <p className="text-center text-gray-400">No anime found.</p>
        ) : (
          <div className="space-y-6">
            {animeList.map((anime) => (
              <Link href={`/anime/${anime.mal_id}`} key={anime.mal_id}>
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
                      src={anime.images.jpg.image_url}
                      alt={anime.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">{anime.title}</h2>
                    <p className="text-sm text-gray-400">Rating: {anime.score}</p>
                    <p className="text-sm text-gray-400">Type: {anime.type}</p>
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