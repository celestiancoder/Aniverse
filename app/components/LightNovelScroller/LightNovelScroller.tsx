
"use client";
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';



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

interface LightNovelScrollerProps {
  title: string;
  items: LightNovel[];
}

const LightNovelScroller = ({ title, items }: LightNovelScrollerProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 940; 
      const scrollPosition = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
        
      scrollContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative py-8">
      <h2 className="text-2xl font-bold text-white mb-4 px-4">{title}</h2>

      
      <div className="absolute inset-y-0 left-0 flex items-center pl-2 z-10">
        <Button
          onClick={() => scroll('left')}
          variant="ghost"
          size="icon"
          className="w-10 h-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-none"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 z-10">
        <Button
          onClick={() => scroll('right')}
          variant="ghost"
          size="icon"
          className="w-10 h-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-none"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-4 pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((novel) => (
          <motion.div
            key={novel.mal_id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="flex-none w-72"
          >
            <Link href={`/novels/${novel.mal_id}`}>
            <Card className="relative group overflow-hidden bg-gray-800 border-0">
              <div className="relative aspect-[2/3]">
                <img
                  src={novel.images.jpg.image_url}
                  alt={novel.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4 p-2 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold text-white">Score: {novel.score}</span>
                  </div>
                  <p className="text-sm text-white">Volumes: {novel.volumes || 'Ongoing'}</p>
                  <p className="text-sm text-white">Status: {novel.status}</p>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white line-clamp-2">{novel.title}</h3>
              </div>
            </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LightNovelScroller;