"use client";

/**
 * Navbar organism - Site-wide navigation with logo, links, search, cart.
 * Responsive: hamburger menu on mobile, full nav on desktop.
 * Includes login modal, cart drawer, search modal, and user dropdown.
 */

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { FiUser, FiShoppingBag, FiSearch, FiX, FiMenu, FiHeart } from "react-icons/fi";
import { useCart } from '@/app/context/CartContext';
import { useWishlist } from '@/app/context/WishlistContext';
import Link from "next/link"; 
import Image from "next/image";
import CartDrawer from "./CartDrawer";
import CheckoutPage from "./CheckoutPage";
import AnnouncementBar from "@/components/AnnouncementBar";
import axios from "axios";
import { Session } from 'next-auth';
import type { PricingUnit } from '@/lib/pricingUnits';
import { BRAND } from '@/lib/brand';


const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

// Define interfaces for search results
interface SearchProduct {
  _id?: string;
  name: string;
  description?: string;
  image?: string;
  pricing?: Array<{
    quantity: number;
    unit: PricingUnit;
    price: number;
  }>;
  type?: string;
}

// Login Modal Component
const LoginModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with blur effect */}
      <div 
        className="fixed inset-0 bg-white bg-opacity-20 backdrop-blur-sm z-[100] transition-all"
        onClick={onClose}
      />
      
      {/* Popup */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all border border-orange-100">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-orange-100">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-2 rounded-xl">
                <FiUser className="h-5 w-5 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Sign In Required</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-orange-500 transition-colors p-1 rounded-lg hover:bg-orange-50"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-4 rounded-2xl">
                <FiShoppingBag className="h-8 w-8 text-orange-500" />
              </div>
            </div>
            
            <div className="text-center mb-6">
              <h4 className="text-xl font-semibold text-gray-800 mb-2">
                Please Sign In First
              </h4>
              <p className="text-gray-600 leading-relaxed">
                You need to be signed in to access your cart and continue shopping. Sign in to save your favorite items.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  signIn('google', { callbackUrl: window.location.href });
                  onClose();
                }}
                className="flex items-center justify-center w-full py-3 px-4 rounded-xl font-semibold text-white transition-all focus:outline-none focus:ring-2 shadow-lg hover:shadow-xl"
                style={{ background: 'linear-gradient(to right, var(--leaf-500), var(--leaf-600))' }}
              >
                <GoogleIcon />
                Continue with Google
              </button>
              <button
                onClick={() => {
                  signIn('yahoo', { callbackUrl: window.location.href });
                  onClose();
                }}
                className="flex items-center justify-center w-full py-3 px-4 rounded-xl font-semibold border-2 bg-white transition-all hover:bg-gray-50"
                style={{ borderColor: 'var(--leaf-200)', color: 'var(--leaf-800)' }}
              >
                <span className="font-bold mr-2" style={{ color: '#6001d2' }}>Y!</span>
                Continue with Yahoo
              </button>
              <Link
                href="/login"
                onClick={onClose}
                className="text-center text-sm font-medium py-2 hover:underline"
                style={{ color: 'var(--leaf-600)' }}
              >
                Sign in with email & password
              </Link>
              <button
                onClick={onClose}
                className="w-full bg-gray-100 text-gray-600 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Mobile Menu Slider Component
const MobileMenuSlider = ({ isOpen, onClose, session }: { isOpen: boolean; onClose: () => void; session: Session | null }) => {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-[90] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Slider */}
      <div
        className={`fixed top-0 left-0 h-full w-80 backdrop-blur-sm z-[95] transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-xl`}
        style={{ backgroundColor: 'color-mix(in srgb, var(--cream) 95%, transparent)' }}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--leaf-200)', background: 'linear-gradient(to right, var(--cream), var(--paper))' }}>
          <div className="flex items-center space-x-3">
            <Image
              src={BRAND.logo}
              alt={BRAND.shortName}
              className="h-14 w-14 object-contain"
              width={56}
              height={56}
            />
            <span className="font-semibold text-green-800">Menu</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-green-100/50 transition-colors"
          >
            <FiX className="h-5 w-5 text-green-800" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="py-4">
          <Link 
            href="/" 
            onClick={onClose}
            className="flex items-center px-6 py-4 text-green-800 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 hover:text-green-900 transition-all font-semibold"
          >
            Home
          </Link>
          
          <Link
            href="/AboutUs"
            onClick={onClose}
            className="flex items-center px-6 py-4 text-green-800 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 hover:text-green-900 transition-all font-semibold"
          >
            About us
          </Link>
          
          <Link 
            href="/collections/moringa" 
            onClick={onClose}
            className="flex items-center px-6 py-4 text-green-800 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 hover:text-green-900 transition-all font-semibold"
          >
            Our products
          </Link>
          
          <Link 
            href="/contact" 
            onClick={onClose}
            className="flex items-center px-6 py-4 text-green-800 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 hover:text-green-900 transition-all font-semibold"
          >
            Contact
          </Link>
          
          <Link 
            href="/wishlist" 
            onClick={onClose}
            className="flex items-center px-6 py-4 text-green-800 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 hover:text-green-900 transition-all font-semibold"
          >
            Wishlist
          </Link>
        </div>

        {/* User Section */}
        <div className="border-t mt-4" style={{ borderColor: 'var(--leaf-200)' }}>
          {session ? (
            <div className="py-4">
              {/* Welcome Section */}
              <div className="px-6 py-4 mx-4 my-2 rounded-xl border" style={{ background: 'linear-gradient(to right, var(--leaf-50), var(--leaf-100))', borderColor: 'var(--leaf-200)' }}>
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl" style={{ background: 'linear-gradient(to bottom right, var(--leaf-100), var(--leaf-200))' }}>
                    <FiUser className="text-lg" style={{ color: 'var(--leaf-600)' }} />
                  </div>
                  <div>
                    <span className="text-sm font-semibold block" style={{ color: 'var(--leaf-800)' }}>Welcome!</span>
                    <span className="text-xs font-medium" style={{ color: 'var(--leaf-600)' }}>
                      {session.user?.name?.split(' ')[0] || session.user?.email?.split('@')[0]}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Menu Items */}
              <Link href="/account" onClick={onClose} className="flex items-center px-6 py-4 font-semibold transition-all hover:opacity-80" style={{ color: 'var(--leaf-800)' }}>
                My Account
              </Link>
              <Link href="/my-orders" onClick={onClose} className="flex items-center px-6 py-4 font-semibold transition-all hover:opacity-80" style={{ color: 'var(--leaf-800)' }}>
                My Orders
              </Link>
              
              {/* Sign Out */}
              <button
                onClick={() => {
                  signOut();
                  onClose();
                }}
                className="flex items-center w-full px-6 py-4 font-semibold transition-all hover:opacity-80"
                style={{ color: 'var(--leaf-800)' }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="p-4">
              <button
                onClick={() => {
                  const callbackUrl = encodeURIComponent(window.location.href);
                  window.location.href = `/login?callbackUrl=${callbackUrl}`;
                  onClose();
                }}
                className="flex items-center justify-center w-full px-6 py-4 rounded-xl transition-all duration-200 font-semibold border-2 hover:shadow-lg"
                style={{ color: 'var(--leaf-800)', borderColor: 'var(--leaf-200)' }}
              >
                <span>Sign in</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutDrawerOpen, setIsCheckoutDrawerOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart } = useCart();
  const { data: session, status } = useSession();

  const toggleCart = () => {
    // Check if user is authenticated before opening cart
    if (status === "unauthenticated") {
      setShowLoginModal(true);
      return;
    }
    setIsCartOpen(!isCartOpen);
  };

  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
  const [allProducts, setAllProducts] = useState<SearchProduct[]>([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);

  // Fetch products for search
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const productsRes = await axios.get('/api/product');
        setAllProducts(productsRes.data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchAllProducts();
  }, []);

  // Close dropdown on outside click
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle search with debouncing
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchQuery && allProducts.length > 0) {
        setIsLoadingSearch(true);
        const filtered = allProducts
          .filter((product) =>
            product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 8);
        setSearchResults(filtered);
        setIsLoadingSearch(false);
      } else {
        setSearchResults([]);
        setIsLoadingSearch(false);
      }
    }, 300);
  
    return () => {
      clearTimeout(timeout);
      setIsLoadingSearch(false);
    };
  }, [searchQuery, allProducts]);
  
  // Handle product click
  const handleProductClick = (product: SearchProduct) => {
    console.log('Clicked product:', product);
    
    const searchParams = new URLSearchParams({
      _pos: '1',
      _psq: searchQuery.substring(0, 4),
      _ss: 'e',
      _v: '1.0'
    });
    
    if (!product._id) {
      console.error('Product ID is missing!');
      return;
    }
    
    const url = `/products/${product._id}?${searchParams.toString()}`;
    console.log('Navigating to URL:', url);
    
    // Navigate to product page
    window.location.href = url;
  };

  // Close search modal
  const closeSearchModal = () => {
    setShowSearchModal(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  // Get price display for search results
  const getPriceDisplay = (product: SearchProduct) => {
    if (product.pricing && product.pricing.length > 0) {
      return product.pricing[0].price;
    }
    return 0;
  };

  // Calculate total cart items
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const { wishlistCount } = useWishlist();

  return (
    <div className="relative">
      {/* Decorative Leaves - Left Edge */}
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 opacity-20 z-0">
        <div className="h-full flex items-center">
          <div className="w-full h-3/4 rounded-r-full blur-md" style={{ backgroundColor: 'var(--moss)' }}></div>
        </div>
      </div>
      
      {/* Decorative Leaves - Right Edge */}
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 opacity-20 z-0">
        <div className="h-full flex items-center justify-end">
          <div className="w-full h-3/4 rounded-l-full blur-md" style={{ backgroundColor: 'var(--moss)' }}></div>
        </div>
      </div>

      <div 
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-300 overflow-hidden shadow-xl"
        style={{ background: 'linear-gradient(to bottom right, var(--leaf-600), var(--leaf-500))' }}
      >
        {/* Contact card inspired overlays and subtle decorative circles */}
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24 pointer-events-none" />

        {/* Moving announcement bar */}
        <AnnouncementBar />
        
        <div className="relative flex items-center justify-between px-2 sm:px-6 lg:px-8 py-0 mx-auto w-full h-24 min-h-24 overflow-visible" style={{ maxWidth: 'var(--content-max)' }}>
          
          {/* Mobile Hamburger Menu - Left Side */}
          <div className="flex items-center space-x-2 sm:space-x-4 z-10 h-full min-w-0">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors md:hidden text-white"
              aria-label="Open navigation menu"
            >
              <FiMenu className="h-6 w-6 drop-shadow-sm" style={{ color: 'var(--leaf-100)' }} />
            </button>
            
            {/* Logo Left */}
            <Link href="/" className="cursor-pointer hover:scale-105 transition-transform duration-300 flex items-center shrink-0 self-center h-[68px] sm:h-[80px] w-auto min-w-[88px] max-w-[160px] sm:max-w-[180px]">
              <Image
                src={BRAND.navbarLogo}
                alt={BRAND.shortName}
                className="h-full w-auto object-contain object-left drop-shadow-md brightness-0 invert"
                width={170}
                height={132}
                priority
              />
            </Link>
          </div>

          {/* Right side: nav links + actions + logo */}
          <div className="flex flex-1 justify-end items-center gap-1 sm:gap-2 md:gap-4 lg:gap-6 min-w-0 ml-2 sm:ml-4 z-10">
            {/* Navigation Links (Desktop Only) */}
            <div className="hidden md:flex items-center space-x-4 lg:space-x-6 shrink-0">
              <Link 
                href="/" 
                className="font-semibold transition-colors text-sm py-2 px-2 drop-shadow-sm hover:underline whitespace-nowrap"
                style={{ color: 'var(--leaf-100)' }}
              >
                Home
              </Link>
              
              <Link
                href="/AboutUs"
                className="font-semibold transition-colors cursor-pointer text-sm py-2 px-2 drop-shadow-sm hover:underline whitespace-nowrap"
                style={{ color: 'var(--leaf-100)' }}
              >
                About us
              </Link>
              
              <Link 
                href="/collections/moringa" 
                className="font-semibold transition-colors text-sm py-2 px-2 drop-shadow-sm hover:underline whitespace-nowrap"
                style={{ color: 'var(--leaf-100)' }}
              >
                Our products
              </Link>
              
              <Link 
                href="/contact" 
                className="font-semibold transition-colors text-sm py-2 px-2 drop-shadow-sm hover:underline whitespace-nowrap"
                style={{ color: 'var(--leaf-100)' }}
              >
                Contact
              </Link>
            </div>

            {/* Icons Section - compact on mobile to avoid overlap */}
            <div className="flex items-center shrink-0">
              {/* Search Icon */}
              <div 
                className="flex items-center justify-center w-9 h-9 sm:w-auto sm:h-auto sm:space-x-2 p-2 sm:p-3 hover:bg-white/20 cursor-pointer transition-all duration-300 rounded-xl"
                onClick={() => setShowSearchModal(true)}
              >
                <FiSearch className="text-lg sm:text-xl transition-colors drop-shadow-sm" style={{ color: 'var(--leaf-200)' }} />
                <span className="hidden sm:block text-sm font-semibold whitespace-nowrap drop-shadow-sm" style={{ color: 'var(--leaf-100)' }}>
                  Search
                </span>
              </div>

              {/* Wishlist Icon */}
              <Link
                href="/wishlist"
                className="flex items-center justify-center w-9 h-9 sm:w-auto sm:h-auto sm:space-x-2 p-2 sm:p-3 hover:bg-white/20 transition-all duration-300 rounded-xl"
              >
                <div className="relative">
                  <FiHeart className="text-lg sm:text-xl transition-colors drop-shadow-sm" style={{ color: 'var(--leaf-200)' }} />
                  <span className="absolute -top-0.5 -right-0.5 text-[10px] bg-white text-green-800 w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-md min-w-4">
                    {wishlistCount}
                  </span>
                </div>
                <span className="hidden sm:block text-sm font-semibold whitespace-nowrap drop-shadow-sm" style={{ color: 'var(--leaf-100)' }}>
                  Wishlist
                </span>
              </Link>
              
              {/* Cart Icon - with login protection */}
              <div 
                className="flex items-center justify-center w-9 h-9 sm:w-auto sm:h-auto sm:space-x-2 relative cursor-pointer p-2 sm:p-3 hover:bg-white/20 transition-all duration-300 rounded-xl" 
                onClick={toggleCart}
              >
                <div className="relative">
                  <FiShoppingBag className="text-lg sm:text-xl transition-colors drop-shadow-sm" style={{ color: 'var(--leaf-200)' }} />
                  {session && totalCartItems > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 text-[10px] bg-gradient-to-r from-orange-500 to-orange-600 text-white w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-lg">
                      {totalCartItems}
                    </span>
                  )}
                  {!session && (
                    <span className="absolute -top-0.5 -right-0.5 text-[10px] bg-gray-400 text-white w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      !
                    </span>
                  )}
                </div>
                <span className="hidden sm:block text-sm font-semibold whitespace-nowrap drop-shadow-sm" style={{ color: 'var(--leaf-100)' }}>
                  Cart
                </span>
              </div>

              {/* User / Account: link on mobile/tablet (avoids full-screen dropdown), dropdown on large screens only */}
              <div ref={dropdownRef} className="relative flex items-center">
                {/* Mobile/tablet: icon-only on small screens to avoid overlap, full label from sm */}
                <Link
                  href={session ? "/account" : "#"}
                  onClick={(e) => {
                    if (!session) {
                      e.preventDefault();
                      setShowLoginModal(true);
                    }
                  }}
                  className="flex md:hidden items-center justify-center w-9 h-9 sm:w-auto sm:h-auto sm:space-x-2 p-2 sm:p-3 hover:bg-white/20 transition-all duration-300 rounded-xl"
                  aria-label={session ? 'Account' : 'Sign In'}
                >
                  <FiUser className="text-xl transition-colors drop-shadow-sm shrink-0" style={{ color: 'var(--leaf-200)' }} />
                  <span className="hidden sm:inline text-sm font-semibold whitespace-nowrap drop-shadow-sm" style={{ color: 'var(--leaf-100)' }}>
                    {session ? 'Account' : 'Sign In'}
                  </span>
                </Link>
                {/* Desktop: dropdown */}
                <div
                  className="hidden md:flex items-center space-x-2 p-3 hover:bg-white/20 cursor-pointer transition-all duration-300 rounded-xl"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <FiUser className="text-xl transition-colors drop-shadow-sm" style={{ color: 'var(--leaf-200)' }} />
                  <span className="text-sm font-semibold whitespace-nowrap drop-shadow-sm" style={{ color: 'var(--leaf-100)' }}>
                    {session ? 'Account' : 'Sign In'}
                  </span>
                </div>
                {showDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-52 max-w-[calc(100vw-2rem)] max-h-[70vh] overflow-y-auto bg-white rounded-2xl shadow-2xl z-[60] animate-in fade-in slide-in-from-top-2 duration-200 border-2 hidden md:block" style={{ borderColor: 'var(--leaf-200)' }}>
                    {session ? (
                      <div className="py-2">
                        {/* Welcome Section */}
                        <div className="px-4 py-4 border-b" style={{ background: 'linear-gradient(to right, var(--leaf-50), var(--leaf-100))', borderColor: 'var(--leaf-200)' }}>
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-xl" style={{ background: 'linear-gradient(to bottom right, var(--leaf-100), var(--leaf-200))' }}>
                              <FiUser className="text-lg" style={{ color: 'var(--leaf-600)' }} />
                            </div>
                            <div>
                              <span className="text-sm font-semibold block" style={{ color: 'var(--leaf-800)' }}>Welcome!</span>
                              <span className="text-xs font-medium" style={{ color: 'var(--leaf-600)' }}>
                                {session.user?.name?.split(' ')[0] || session.user?.email?.split('@')[0]}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Menu Items */}
                        <div className="py-1">
                          <Link href="/account" className="block px-4 py-3 text-sm font-semibold transition-all duration-200 hover:opacity-80" style={{ color: 'var(--leaf-800)' }}>
                            My Account
                          </Link>
                          <Link href="/my-orders" className="block px-4 py-3 text-sm font-semibold transition-all duration-200 hover:opacity-80" style={{ color: 'var(--leaf-800)' }}>
                            My Orders
                          </Link>
                        </div>

                        {/* Sign Out Section */}
                        <div className="border-t py-1" style={{ borderColor: 'var(--leaf-200)' }}>
                          <button
                            onClick={() => signOut()}
                            className="block w-full text-left px-4 py-3 text-sm font-semibold transition-all duration-200 hover:opacity-80"
                            style={{ color: 'var(--leaf-800)' }}
                          >
                            Sign Out
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3">
                        <button
                          onClick={() => {
                            const callbackUrl = encodeURIComponent(window.location.href);
                            window.location.href = `/login?callbackUrl=${callbackUrl}`;
                          }}
                          className="flex items-center justify-center w-full px-6 py-4 rounded-xl transition-all duration-200 font-semibold border-2 hover:shadow-lg"
                          style={{ color: 'var(--leaf-800)', borderColor: 'var(--leaf-200)' }}
                        >
                          <span>Sign in</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>

            {/* Cart Drawer - only show if authenticated */}
            {session && (
              <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                onCheckoutRequested={() => {
                  setIsCartOpen(false);
                  setIsCheckoutDrawerOpen(true);
                }}
              />
            )}

            {/* Checkout slide-in drawer - same-page experience */}
            {session && isCheckoutDrawerOpen && (
              <>
                <div
                  className="fixed inset-0 z-[45] bg-black/20 backdrop-blur-sm"
                  onClick={() => setIsCheckoutDrawerOpen(false)}
                  aria-hidden
                />
                <div className="fixed top-0 right-0 h-full w-full max-w-lg bg-white z-50 shadow-2xl overflow-y-auto flex flex-col animate-in slide-in-from-right duration-300">
                  <div className="flex-shrink-0 flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--leaf-200)' }}>
                    <h2 className="text-lg font-semibold" style={{ color: 'var(--leaf-800)' }}>Checkout</h2>
                    <button
                      onClick={() => setIsCheckoutDrawerOpen(false)}
                      className="p-2 rounded-full hover:bg-gray-100"
                      aria-label="Close"
                    >
                      <FiX className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <CheckoutPage embedded onCloseDrawer={() => setIsCheckoutDrawerOpen(false)} />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

     {/* Mobile Menu Slider */}
<MobileMenuSlider 
  isOpen={isMobileMenuOpen} 
  onClose={() => setIsMobileMenuOpen(false)}
  session={session}
/>
      

      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

      {/* Full Screen Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm z-50 animate-in fade-in duration-300">
          <div className="flex flex-col h-full">
            
            {/* Search Header */}
            <div className="flex items-center justify-center py-6 sm:py-8 border-b rounded-2xl" style={{ borderColor: 'var(--leaf-200)', background: 'linear-gradient(to right, var(--leaf-50), #fff)' }}>
              <div className="w-full max-w-2xl px-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6" style={{ color: 'var(--leaf-800)' }}>
                  Search our site
                </h2>
                
                {/* Search Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiSearch className="h-5 w-5" style={{ color: 'var(--leaf-500)' }} />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-12 pr-12 py-3 sm:py-4 text-base sm:text-lg border-2 rounded-2xl outline-none shadow-lg focus:ring-2 focus:ring-[var(--leaf-500)] focus:border-[var(--leaf-500)]"
                    style={{ borderColor: 'var(--leaf-200)', background: 'linear-gradient(to right, #fff, var(--leaf-50))' }}
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    >
                      <FiX className="h-5 w-5" style={{ color: 'var(--leaf-500)' }} />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Close Button */}
              <button
                onClick={closeSearchModal}
                className="absolute top-4 right-4 p-2 rounded-xl transition-colors"
                style={{ color: 'var(--leaf-800)' }}
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            {/* Search Results */}
            <div className="flex-1 overflow-y-auto" style={{ background: 'linear-gradient(to bottom, #fff, var(--leaf-50))' }}>
              <div className="max-w-4xl mx-auto px-4 py-8">
                
                {searchQuery && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-800">Products</h3>
                      {searchResults.length > 0 && (
                        <button className="text-sm font-semibold flex items-center" style={{ color: 'var(--leaf-600)' }}>
                          View all →
                        </button>
                      )}
                    </div>
                    
                    {isLoadingSearch ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--leaf-500)' }}></div>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {searchResults.map((product: SearchProduct) => (
                          <div
                            key={product._id || Math.random()}
                            className="bg-white rounded-2xl border-2 hover:shadow-2xl transition-all duration-300 cursor-pointer group overflow-hidden"
                            style={{ borderColor: 'var(--leaf-200)' }}
                            onClick={() => handleProductClick(product)}
                          >
                            {/* Product Image */}
                            <div className="aspect-square overflow-hidden rounded-t-2xl relative" style={{ background: 'linear-gradient(to bottom right, var(--leaf-50), var(--leaf-100))' }}>
                              {product.image ? (
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 20vw"
                                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, var(--leaf-100), var(--leaf-200))' }}>
                                  <span className="text-sm font-semibold" style={{ color: 'var(--leaf-500)' }}>No Image</span>
                                </div>
                              )}
                            </div>
                            
                            {/* Product Details */}
                            <div className="p-4" style={{ background: 'linear-gradient(to bottom, #fff, var(--leaf-50))' }}>
                              <h4 className="font-bold mb-2 line-clamp-2" style={{ color: 'var(--leaf-800)' }}>
                                {product.name}
                              </h4>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500 line-through">
                                  Rs. {(getPriceDisplay(product) * 1.2).toFixed(2)}
                                </span>
                                <span className="font-bold" style={{ color: 'var(--leaf-600)' }}>
                                  From Rs. {getPriceDisplay(product)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500 font-semibold">
                          &quot; No products found for {searchQuery} &quot;
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {!searchQuery && (
                  <div className="text-center py-20">
                    <div className="p-6 rounded-2xl inline-block mb-4" style={{ background: 'linear-gradient(to bottom right, var(--leaf-100), var(--leaf-200))' }}>
                      <FiSearch className="h-16 w-16 mx-auto" style={{ color: 'var(--leaf-500)' }} />
                    </div>
                    <p className="text-gray-500 text-lg font-semibold">
                      Start typing to search for products...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
