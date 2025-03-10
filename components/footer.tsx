import React from 'react';
import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import { Mail } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">About</h3>
            <p className="text-sm">
              Discover your next favorite anime, manga, and games. Stay updated with the latest releases
              and join our community of enthusiasts.
            </p>
          </div>

         
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/anime" className="hover:text-white transition-colors">Anime</Link></li>
              <li><Link href="/manga" className="hover:text-white transition-colors">Manga</Link></li>
              <li><Link href="/novels" className="hover:text-white transition-colors">Novel</Link></li>
              
              
            </ul>
          </div>

          
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Connect</h3>
            <div className="flex space-x-4">
              <Link
                href="https://github.com/celestiancoder"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                <GitHubLogoIcon className="w-6 h-6" />
              </Link>
              <Link
                href="https://linkedin.com/in/devaditta-patra-086220333"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                <LinkedInLogoIcon className="w-6 h-6" />
              </Link>
              <Link
                href="devarchon@gmail.com"
                className="hover:text-white transition-colors"
              >
                <Mail className="w-6 h-6" />
              </Link>
              
            </div>
          </div>
        </div>

        
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">
              ©  AniVerse. All rights reserved.
            </p>
           
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;