import Link from 'next/link';
import LightNovelScroller from '../components/LightNovelScroller/LightNovelScroller';

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
  volumes: number;
  status: string;
}

export default async function NovelsPage() {
  let topNovels: LightNovel[] = [];

  try {
    const res = await fetch('https://api.jikan.moe/v4/top/manga?type=lightnovel', {
      next: { revalidate: 10 },
    });
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await res.json();
    topNovels = data.data?.map((novel: LightNovel) => ({
      mal_id: novel.mal_id,
      title: novel.title,
      score: novel.score,
      type: novel.type,
      images: novel.images,
      volumes: novel.volumes,
      status: novel.status,
    })) || [];
  } catch (error) {
    console.error('Error fetching light novels:', error);
  }

  return (
    <div className="min-h-screen p-8 bg-gray-900">
      <LightNovelScroller title="Popular Light Novels" items={topNovels} />
      <div className="mt-8 text-center">
        <Link
          href="/novels/list"
          className="space-x-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          Want to see more novels?
        </Link>
      </div>
    </div>
  );
}
