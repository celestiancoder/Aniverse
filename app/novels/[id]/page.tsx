'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import LoadingSpinner from '../loading';
import { use } from 'react';
import Image from 'next/image';
import BookmarkButton from '@/components/BookmarkButton';

interface Novel {
  mal_id: number;
  title: string;
  score: number;
  type: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
  synopsis: string;
  chapters: number;
  volumes: number;
  status: string;
  published: {
    string: string;
  };
  genres: Array<{ name: string }>;
  authors: Array<{
    name: string;
  }>;
}

async function fetchNovelDetails(id: string) {
  const response = await axios.get(`https://api.jikan.moe/v4/manga/${id}`);
  return response.data.data;
}

type Props = {
  params: Promise<{ id: string }>
}

export default function NovelDetailsPage({ params }: Props) {
  const { id } = use(params);
  const [novel, setNovel] = useState<Novel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchNovelDetails(id);
        setNovel(data);
      } catch (error) {
        console.error('Error fetching novel details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  if (!novel) {
    return <p className="text-center text-gray-400">Novel not found.</p>;
  }

  return (
    <div className="min-h-screen p-8 py-32 bg-gray-900">
      
      <motion.div
        initial={{ clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)' }}
        animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
        transition={{ duration: 1, ease: 'easeInOut' }}
        className="flex flex-col md:flex-row gap-8"
      >
        
        <div className="w-full md:w-1/3">
          <Image
          height={500}
          width={300}
            src={novel.images.jpg.image_url}
            alt={novel.title}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        
        <div className="w-full md:w-2/3 text-white">
          <h1 className="text-4xl font-bold mb-4">{novel.title}</h1>
          <p className="text-3xl mb-4">{novel.synopsis}</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400">Type:</p>
              <p>{novel.type}</p>
            </div>
            <div>
              <p className="text-gray-400">Authors:</p>
              <p>{novel.authors?.map((author) => author.name).join(', ') || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-gray-400">Chapters:</p>
              <p>{novel.chapters || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-gray-400">Volumes:</p>
              <p>{novel.volumes || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-gray-400">Status:</p>
              <p>{novel.status}</p>
            </div>
            <div>
              <p className="text-gray-400">Published:</p>
              <p>{novel.published.string}</p>
            </div>
            <div>
              <p className="text-gray-400">Genres:</p>
              <p>{novel.genres.map((genre) => genre.name).join(', ')}</p>
            </div>
            <div>
              <p className="text-gray-400">Rating:</p>
              <p>{novel.score || 'N/A'}</p>
            </div>
            <BookmarkButton itemId={id} itemType="manga" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}