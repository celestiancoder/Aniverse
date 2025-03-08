'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, User } from 'lucide-react';
import NavbarSearch from '@/components/NavbarSearch';
import { Button } from '@/components/ui/button';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import BookmarkButton from '@/components/BookmarkButton';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/70 backdrop-blur-xl shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between px-4 py-3">
            
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
                AnimeVerse
              </span>
            </Link>

            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/anime" className="text-white/90 hover:text-white transition-colors">
                Anime
              </Link>
              <Link href="/manga" className="text-white/90 hover:text-white transition-colors">
                Manga
              </Link>
              <Link href="/novels" className="text-white/90 hover:text-white transition-colors">
                Novels
              </Link>
              <Link href="/Bookmarks" className="text-white/90 hover:text-white transition-colors">Bookmarks</Link>
            </div>

            
            <div className="hidden md:flex items-center space-x-6">
              
              <NavbarSearch />

              {session ? (
                <div className="relative">
                  
                  <Button 
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-2"
                  >
                    <Image
                      src={session.user?.image || '/default-profile.png'}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span>{session.user?.name}</span>
                  </Button>
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                      >
                        Profile
                      </Link>
                      
                      <Button
                        onClick={() => signOut()}
                        className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-200"
                      >
                        Logout
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login">
                  <Button className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                    <User size={18} />
                    <span>Sign In</span>
                  </Button>
                </Link>
              )}
            </div>

            
            <button 
              className="md:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/95 backdrop-blur-lg flex flex-col">
          <div className="flex-1 px-4 pt-20 pb-6 flex flex-col">
           
            <div className="space-y-6 flex-1">
              <Link 
                href="/anime" 
                className="block text-xl text-white/90 hover:text-white transition-colors py-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Anime
              </Link>
              <Link 
                href="/manga" 
                className="block text-xl text-white/90 hover:text-white transition-colors py-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Manga
              </Link>
              <Link 
                href="/novels" 
                className="block text-xl text-white/90 hover:text-white transition-colors py-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Novels
              </Link>
            </div>

            
            <div className="mt-6 pb-96">
              <NavbarSearch />
            </div>

            
            {session ? (
              <Button 
                onClick={() => signOut()}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-4 rounded-lg hover:opacity-90 transition-opacity mt-4"
              >
                <span className="text-lg">Logout</span>
              </Button>
            ) : (
              <Button className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-4 rounded-lg hover:opacity-90 transition-opacity mt-4">
                <User size={20} />
                <span className="text-lg"><Link href="/login">Sign In</Link></span>
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;