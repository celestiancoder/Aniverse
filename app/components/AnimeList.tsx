import Link from 'next/link';
import { Anime } from '../types';
import Image from 'next/image';


interface AnimeListProps {
  anime: Anime[];
}

export default function AnimeList({ anime }: AnimeListProps) {
  return (
    <div className="flex overflow-x-auto gap-4 py-4 scrollbar-hide">
      {anime.map((item) => (
        <Link key={item.id} href={`/anime/${item.id}`} passHref>
          <div className="flex-shrink-0 w-48 bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer hover:scale-105 transition-transform">
            <Image
            width={300}
            height={500}
              src={item.image}
              alt={item.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-white truncate">
                {item.title}
              </h3>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}