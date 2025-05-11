import React from 'react';
import { MagnifyingGlassIcon, ShoppingBagIcon, KeyIcon } from '@heroicons/react/24/outline';
import { CartItem } from './ProductGrid';

interface HeaderProps {
  cartItems: CartItem[];
  onCartClick: () => void;
  onSearchChange: (query: string) => void;
  onAdminClick: () => void;
  searchQuery: string;
}

const Header: React.FC<HeaderProps> = ({ 
  cartItems, 
  onCartClick, 
  onSearchChange, 
  onAdminClick,
  searchQuery 
}) => {
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-black text-white w-full">
      <div className="max-w-[1919px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[92px]">
          <div className="flex items-center">
            <h1 
              style={{ 
                color: '#fd4e2b',
                width: '135px',
                height: '77px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                lineHeight: '1'
              }} 
              className="font-bold"
            >
              GEEKS
            </h1>
          </div>
          
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full px-6 py-3 rounded-lg bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg"
              />
              <MagnifyingGlassIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative group">
              <button
                onClick={onAdminClick}
                className="relative w-[57px] h-[64px] flex items-center justify-center rounded-full hover:bg-gray-800 transition-colors"
              >
                <KeyIcon className="h-8 w-8" />
              </button>
              <div className="absolute right-0 mt-2 w-32 bg-black text-white text-sm rounded-md py-2 px-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                Admin Login
              </div>
            </div>
            <button
              onClick={onCartClick}
              className="relative w-[57px] h-[64px] flex items-center justify-center rounded-full hover:bg-gray-800 transition-colors"
            >
              <ShoppingBagIcon className="h-8 w-8" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 