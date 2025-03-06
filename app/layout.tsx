import type { Metadata } from "next";

import "./globals.css";
import Navbar from "./components/navbar/navbar";
import { Jim_Nightshade } from "next/font/google";
import { SessionProvider } from "next-auth/react";



const Jim_NightshadeFont=Jim_Nightshade({
  subsets:["latin"],
  weight:"400"
})




export const metadata: Metadata = {
  title: 'Anime Recommendation Site | Find the Best Anime, Manga, and Light Novels',
  description: 'Discover the best anime, manga, and light novels. Get personalized recommendations, bookmark your favorites, and join the community.',
  keywords: ['anime', 'manga', 'light novel'],
  authors: [{ name: 'Devaditta Patra', url: 'https://yourwebsite.com' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` antialiased ${Jim_NightshadeFont.className} text-2xl`}
      >

        <SessionProvider><Navbar /></SessionProvider>
        
       
        
        
        {children}
        
      </body>
    </html>
  );
}
