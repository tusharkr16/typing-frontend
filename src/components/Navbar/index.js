'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setHasToken(!!localStorage.getItem('token'));
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, isMounted]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setHasToken(false);
    closeSidebar();
    router.push('/');
  };

  const AuthDependentContent = ({ children }) => {
    if (!isMounted) return null;
    return children;
  };

  return (
    <>
      <nav className="bg-indigo-600 shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between">
            <div className="flex space-x-7">
              <Link href="/" className="flex items-center py-4 px-2">
                <span className="font-semibold text-white text-lg">TypeMaster</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              <Link 
                href="/" 
                className={`py-4 px-2 ${pathname === '/' ? 'text-white border-b-4 border-white' : 'text-white hover:text-indigo-200'}`}
              >
                Home
              </Link>
              
              <AuthDependentContent>
                {hasToken ? (
                  <>
                    
                    <Link 
                      href="/session" 
                      className={`py-4 px-2 ${pathname === '/session' ? 'text-white border-b-4 border-white' : 'text-white hover:text-indigo-200'}`}
                    >
                      Typing test
                    </Link>
                    <Link 
                      href="/dashboard" 
                      className={`py-4 px-2 ${pathname === '/dashboard' ? 'text-white border-b-4 border-white' : 'text-white hover:text-indigo-200'}`}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="py-4 px-2 text-white hover:text-indigo-200"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link 
                    href="/signup" 
                    className={`py-4 px-2 ${pathname === '/signup' ? 'text-white border-b-4 border-white' : 'text-white hover:text-indigo-200'}`}
                  >
                    Sign Up
                  </Link>
                )}
              </AuthDependentContent>
            </div>
            <div className="md:hidden flex items-center">
              <button 
                onClick={toggleSidebar}
                className="outline-none mobile-menu-button p-2"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {isMounted && (
        <div 
          className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={closeSidebar}
        />
      )}

      {isMounted && (
        <div 
          className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex justify-end p-4">
            <button 
              onClick={closeSidebar}
              className="text-gray-600 p-2 focus:outline-none hover:text-indigo-600"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div className="flex flex-col space-y-4 px-6 py-4">
            <Link 
              href="/" 
              className={`py-3 px-4 text-gray-800 rounded-md text-lg font-medium ${pathname === '/' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100'}`}
              onClick={closeSidebar}
            >
              Home
            </Link>
            
            <AuthDependentContent>
              {hasToken ? (
                <>
                  <Link 
                    href="/session" 
                    className={`py-3 px-4 text-gray-800 rounded-md text-lg font-medium ${pathname === '/session' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100'}`}
                    onClick={closeSidebar}
                  >
                    typing test
                  </Link>
                  <Link 
                    href="/dashboard" 
                    className={`py-3 px-4 text-gray-800 rounded-md text-lg font-medium ${pathname === '/dashboard' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100'}`}
                    onClick={closeSidebar}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="py-3 px-4 text-left text-gray-800 rounded-md text-lg font-medium hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  href="/signup" 
                  className={`py-3 px-4 text-gray-800 rounded-md text-lg font-medium ${pathname === '/signup' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100'}`}
                  onClick={closeSidebar}
                >
                  Sign Up
                </Link>
              )}
            </AuthDependentContent>
          </div>
        </div>
      )}
    </>
  );
}