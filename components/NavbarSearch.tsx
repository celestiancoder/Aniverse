"use client";
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Search } from 'lucide-react';
import Image from 'next/image'; // Import the Image component

interface AnimeResponse {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
}

interface MangaResponse {
  mal_id: number;
  title: string;
  type: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
}

interface SearchResult {
  mal_id: number;
  title: string;
  type: 'anime' | 'manga' | 'novel';
  image_url: string;
}

const NavbarSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const fetchSearchResults = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const [animeResponse, mangaResponse] = await Promise.all([
        axios.get<{ data: AnimeResponse[] }>(`https://api.jikan.moe/v4/anime?q=${query}&limit=3`),
        axios.get<{ data: MangaResponse[] }>(`https://api.jikan.moe/v4/manga?q=${query}&limit=3`),
      ]);

      const animeResults = animeResponse.data.data.map((item) => ({
        mal_id: item.mal_id,
        title: item.title,
        type: 'anime' as const, // Explicitly type as 'anime'
        image_url: item.images.jpg.image_url,
      }));

      const mangaResults = mangaResponse.data.data.map((item) => {
        // Explicitly type the `type` property
        const resultType: 'manga' | 'novel' = item.type === 'Light Novel' || item.type === 'Novel' ? 'novel' : 'manga';
        return {
          mal_id: item.mal_id,
          title: item.title,
          type: resultType, // Use the explicitly typed variable
          image_url: item.images.jpg.image_url,
        };
      });

      setResults([...animeResults, ...mangaResults]);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          console.error('No results found for the query:', query);
        } else {
          console.error('Error fetching search results:', error.message);
        }
      } else {
        console.error('Unexpected error:', error);
      }
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={searchRef}>
      <div className="flex items-center">
        <button
          className="text-white/90 hover:text-white transition-colors p-2"
          onClick={() => {
            setIsDropdownVisible(!isDropdownVisible);
            if (!isDropdownVisible) {
              setTimeout(() => {
                const inputElement = document.querySelector('input[type="text"]');
                if (inputElement instanceof HTMLInputElement) {
                  inputElement.focus();
                }
              }, 0);
            }
          }}
        >
          <Search size={20} />
        </button>
      </div>

      {isDropdownVisible && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search anime, manga, novels..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                fetchSearchResults(e.target.value);
              }}
              className="w-full px-4 py-2 rounded-t-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {isLoading ? (
            <div className="p-4 text-gray-400">Loading...</div>
          ) : results.length > 0 ? (
            results.map((result) => (
              <Link
                key={result.mal_id}
                href={`/${result.type}/${result.mal_id}`}
                onClick={() => setIsDropdownVisible(false)}
              >
                <div className="flex items-center p-2 hover:bg-gray-700 cursor-pointer">
                  <Image
                    src={result.image_url}
                    alt={result.title}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-md object-cover"
                  />
                  <div className="ml-3">
                    <span className="text-white">{result.title}</span>
                    <span className="block text-xs text-gray-400 capitalize">
                      {result.type}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : query.trim() ? (
            <div className="p-4 text-gray-400">No results found.</div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default NavbarSearch;