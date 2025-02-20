import Footer from '@/components/footer';
import AnimeScroller from './components/AnimeScroller/AnimeScroller';
import { HeroParallax } from './components/ui/hero-parallex';
import { AnimatedTechStack } from '@/components/ui/AnimatedTechStack';



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
const techStack = [
  {
    name: "Next.js",
    description: "A React framework for building server-rendered applications.",
    src: "/images/nextjslogo.webp", 
  },
  {
    name: "Tailwind CSS",
    description: "A utility-first CSS framework for rapid UI development.",
    src: "/images/tailwindlogo.webp", 
  },
  {
    name: "TypeScript",
    description: "A typed superset of JavaScript for better developer experience.",
    src: "/images/typescriptlogo.png", 
  },
  {
    name: "Framer Motion",
    description: "A production-ready motion library for React.",
    src: "/images/framerlogo.jpg", 
  },
  
];




const products = [
  {
    title: "Attack on Titan",
    link: "/anime/attack-on-titan",
    thumbnail: "/images/6257388.jpg",
  },
  {
    title: "One Piece",
    link: "/manga/13",
    thumbnail: "/images/onepiece.jpg",
  },
  {
    title: "Fate-Stay-night",
    link: "/anime/356",
    thumbnail: "/images/fatestay.jpg",
  },
  {
    title: "Cyberpunk-Edgerunners",
    link: "/anime/42310",
    thumbnail: "/images/Cyberpunkedge.jpg",
  },
  {
    title: "Naruto",
    link: "/manga/11",
    thumbnail: "/images/Narutomanga.jpg",
  },
  
  {
    title: "Your-Name",
    link: "/anime/32281",
    thumbnail: "/images/yournameim.jpg",
  },
  {
    title: "Suzume",
    link: "/anime/50594",
    thumbnail: "/images/suzume.webp",
  },
  {
    title: "Death Note",
    link: "/manga/21",
    thumbnail: "/images/deathnotemanga.jpg",
  },
  
  {
    title: "Arknights",
    link: "/game/arknights",
    thumbnail: "/images/ark.jpg",
  },
  
];

export default function Home() {
  return (
    <div>
      
      <div className="min-h-screen bg-gray-900 text-white">
      
      <HeroParallax products={products} />
      <div className="flex justify-center">
        Highlights of Tech Stacks used
      </div>
      
      <AnimatedTechStack techStack={techStack} autoplay={true} />
      <div className='flex justify-center font-extrabold py-32' >
        More Updates coming in the future including a comment feature ! Stay Tuned
      </div>
      <Footer></Footer>
      


      
    </div>
  
    </div>
    
  )
    
}






