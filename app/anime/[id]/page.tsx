'use client'; 

import React, { useEffect, useState, useRef, useCallback, use } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios'; 
import LoadingSpinner from '../loading';
import Image from 'next/image';



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
  synopsis: string;
  episodes: number;
  status: string;
  aired: {
    string: string;
  };
  genres: Array<{ name: string }>;
}

interface Character {
  character: {
    mal_id: number;
    name: string;
    images: {
      jpg: {
        image_url: string;
      };
    };
  };
  role: string;
  voice_actors: Array<{
    person: {
      name: string;
      images: {
        jpg: {
          image_url: string;
        };
      };
    };
    language: string;
  }>;
}


async function fetchAnimeDetails(id: string) {
  const response = await axios.get(`https://api.jikan.moe/v4/anime/${id}`);
  return response.data.data;
}


async function fetchCharacters(id: string, page: number = 1) {
  const response = await axios.get(`https://api.jikan.moe/v4/anime/${id}/characters?page=${page}`);
  return response.data.data;
}

type Props = {
  params: Promise<{ id: string }> 
}


export default function AnimeDetailsPage({ params }: Props) {
  
  const { id } = use(params);

  const [anime, setAnime] = useState<Anime | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [animeData, characterData] = await Promise.all([
          fetchAnimeDetails(id),
          fetchCharacters(id, page),
        ]);
        setAnime(animeData);
        setCharacters(characterData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id,page]);


  const fetchMoreCharacters = useCallback(async () => {
    if (!hasMore) return;

    try {
      const nextPage = page + 1;
      const newCharacters = await fetchCharacters(id, nextPage);

      if (newCharacters.length === 0) {
        setHasMore(false); 
      } else {
        setCharacters((prev) => [...prev, ...newCharacters]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error('Error fetching more characters:', error);
    }
  }, [id, page, hasMore]);

  
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      if (scrollWidth - (scrollLeft + clientWidth) < 100) {
        fetchMoreCharacters();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [fetchMoreCharacters,page]);

  if (loading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  if (!anime) {
    return <p className="text-center text-gray-400">Anime not found.</p>;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-900 py-32">
      
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
            src={anime.images.jpg.image_url}
            
            alt={anime.title}
            className="w-full h-auto rounded-lg shadow-lg"
          />
          
        </div>

        
        <div className="w-full md:w-2/3 text-white">
          <h1 className="text-4xl font-bold mb-4">{anime.title}</h1>
          <p className="text-3xl mb-4">{anime.synopsis}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400">Type:</p>
              <p>{anime.type}</p>
            </div>
            <div>
              <p className="text-gray-400">Episodes:</p>
              <p>{anime.episodes}</p>
            </div>
            <div>
              <p className="text-gray-400">Status:</p>
              <p>{anime.status}</p>
            </div>
            <div>
              <p className="text-gray-400">Aired:</p>
              <p>{anime.aired.string}</p>
            </div>
            <div>
              <p className="text-gray-400">Genres:</p>
              <p>{anime.genres.map((genre) => genre.name).join(', ')}</p>
            </div>
            <div>
              <p className="text-gray-400">Rating:</p>
              <p>{anime.score}</p>
            </div>
          </div>
        </div>
      </motion.div>

      
      <section className="mt-12 relative">
        <h2 className="text-2xl font-bold text-white mb-6">Characters</h2>
        <div className="relative">
          
          <button
            onClick={() => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 p-2 rounded-full shadow-lg z-10 hover:bg-gray-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          
          <button
            onClick={() => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 p-2 rounded-full shadow-lg z-10 hover:bg-gray-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          
          <div
            ref={scrollRef}
            className="flex overflow-x-auto scrollbar-hide gap-4 py-4"
          >
            {characters.map((character) => (
              <div
                key={character.character.mal_id}
                className="flex-shrink-0 w-48 bg-gray-800 rounded-lg p-4 shadow-lg"
              >
                <Image
                  src={character.character.images.jpg.image_url}
                  alt={character.character.name}
                  height={500}
                  width={300}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <h3 className="text-lg font-semibold text-white">
                  {character.character.name}
                </h3>
                <p className="text-sm text-gray-400 mb-2">Role: {character.role}</p>
                {character.voice_actors.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-400">Voice Actor:</p>
                    <div className="flex items-center mt-1">
                      <Image
                      height={500}
                      width={300}
                        src={character.voice_actors[0].person.images.jpg.image_url}
                        alt={character.voice_actors[0].person.name}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <p className="text-sm text-white">
                        {character.voice_actors[0].person.name} ({character.voice_actors[0].language})
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
