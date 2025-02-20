export interface Anime {
    id: number;
    title: string;
    image: string;
  }
  
  export interface UpcomingAnime {
    id: number;
    title: string;
    date: string;
    type?: string;
    episodes?: number;
    synopsis?: string;
    images?: {
      jpg?: {
        image_url: string;
      };
    };
  }
  
  export interface AnimeNews {
    id: number;
    title: string;
    description: string;
    url?:string;
    date?:string;
  }

  export interface SearchResult {
    mal_id: number;
    title: string;
    type: 'anime' | 'manga' | 'novel';
    image_url: string;
  }

  
