import axios from 'axios'; // Import AxiosError
import AnimeScroller from '../components/AnimeScroller/AnimeScroller';
import Link from 'next/link';
import AnimeList from '../components/AnimeList';
import AnimeNews from '../components/AnimeNews';
import {  AnimeNews as AnimeNewsType } from '../types';

interface JikanAnimeResponse {
  data: JikanAnime[];
}

interface JikanAnime {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
  aired?: {
    from: string;
  };
  score?: number;
  type?: string;
}

interface JikanNewsResponse {
  data: JikanNewsItem[];
}

interface JikanNewsItem {
  mal_id: number;
  title: string;
  excerpt: string;
  url: string;
  date: string;
}

interface CurrentSeasonAnime {
  id: number;
  title: string;
  image: string;
}

interface TopAnime {
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

const api = axios.create({
  baseURL: 'https://api.jikan.moe/v4',
});

api.interceptors.response.use(undefined, async (error) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 429) {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if error.config is defined
      if (error.config) {
        return api.request(error.config);
      }
    }
  }

  // If error.config is undefined, reject the error
  return Promise.reject(error);
});

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (url: string, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      if (i > 0) await delay(1000);
      const response = await api.get<JikanAnimeResponse | JikanNewsResponse>(url);
      return response.data;
    } catch (error) {
      if (i === retries - 1) throw error;

      // Type guard to check if error is an AxiosError
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          await delay(1000);
          continue;
        }
      }

      throw error;
    }
  }
};

const fetchCurrentSeasonAnime = async (): Promise<CurrentSeasonAnime[]> => {
  try {
    const data = await fetchWithRetry('/seasons/now') as JikanAnimeResponse;
    return data.data.map((anime: JikanAnime) => ({
      id: anime.mal_id,
      title: anime.title,
      image: anime.images.jpg.image_url,
    }));
  } catch (error) {
    console.error('Error fetching current season anime:', error);
    return [];
  }
};

const fetchAnimeNews = async (): Promise<AnimeNewsType[]> => {
  try {
    const data = await fetchWithRetry('/anime/1535/news') as JikanNewsResponse;
    return data.data.map((news: JikanNewsItem) => ({
      id: news.mal_id,
      title: news.title,
      description: news.excerpt,
      url: news.url,
      date: news.date
    }));
  } catch (error) {
    console.error('Error fetching anime news:', error);
    return [];
  }
};

const fetchTopAnime = async (): Promise<TopAnime[]> => {
  try {
    const data = await fetchWithRetry('/top/anime?limit=20') as JikanAnimeResponse;
    return data.data.map((anime: JikanAnime) => ({
      mal_id: anime.mal_id,
      title: anime.title,
      score: anime.score ?? 0,
      type: anime.type ?? 'Unknown',
      images: anime.images,
    }));
  } catch (error) {
    console.error('Error fetching top anime:', error);
    return [];
  }
};

export default async function AnimePage() {
  try {
    const [topAnime, currentSeasonAnime, animeNews] = await Promise.all([
      fetchTopAnime(),
      delay(500).then(() => fetchCurrentSeasonAnime()),
      delay(1500).then(() => fetchAnimeNews()),
    ]);

    return (
      <div className="min-h-screen p-8 bg-gray-900">
        <AnimeScroller title="Popular Anime" items={topAnime} />

        <div className="mt-8 text-center flex items-center justify-center">
          <Link
            href="/anime/list"
            className="space-x-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Want to see more anime?
          </Link>
        </div>
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-8 text-white">Anime Page</h1>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-white">Current Season Anime</h2>
            {currentSeasonAnime.length > 0 ? (
              <AnimeList anime={currentSeasonAnime} />
            ) : (
              <p className="text-gray-400">No current season anime available.</p>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">Anime News</h2>
            {animeNews.length > 0 ? (
              <AnimeNews news={animeNews} />
            ) : (
              <p className="text-gray-400">No news available at the moment.</p>
            )}
          </section>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in AnimePage:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="text-gray-400">Please try again later</p>
        </div>
      </div>
    );
  }
}