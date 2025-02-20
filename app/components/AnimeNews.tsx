import { AnimeNews as AnimeNewsType } from '../types';

interface AnimeNewsProps {
  news: AnimeNewsType[];
}

export default function AnimeNews({ news }: AnimeNewsProps) {
  return (
    <div className="space-y-4">
      {news.map((item) => (
        <div key={item.id} className="bg-gray-800 rounded-lg shadow-md p-6 hover:bg-gray-700 transition-colors">
          <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
          <p className="text-gray-300">{item.description}</p>
          {item.url && (
            <a 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 mt-2 inline-block"
            >
              Read more →
            </a>
          )}
        </div>
      ))}
    </div>
  );
}