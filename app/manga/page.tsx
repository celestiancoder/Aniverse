import MangaScroller from '../components/MangaScroller/MangaScroller';
import Link from 'next/link';

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
  chapters: number;
  volumes: number;
}

export default async function MangaPage() {
  
  const res = await fetch('https://api.jikan.moe/v4/top/manga?type=manga', {
    next: { revalidate: 10 },
  });
  const data = await res.json();

  
  const topManga: Manga[] = data.data.map((manga: any) => ({
    mal_id: manga.mal_id,
    title: manga.title,
    score: manga.score,
    type: manga.type,
    images: manga.images,
    chapters: manga.chapters,
    volumes: manga.volumes,
  }));

  return (
    <div className="min-h-screen p-8 bg-gray-900">
     
      <MangaScroller title="Popular Manga" items={topManga} />

      
      <div className="mt-8 text-center">
        <Link
          href="/manga/list"
          className="space-x-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          Want to see more manga?
        </Link>
      </div>
    </div>
  );
}
