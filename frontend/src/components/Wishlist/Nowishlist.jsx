import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Button } from '../ui/button';

const Nowishlist = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] bg-white flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-500">
          <Heart className="w-10 h-10 text-gray-300 fill-gray-50" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
          Save items you love to buy them later. Explore our latest collections and find your new favorites.
        </p>
        <Button
          onClick={() => navigate('/products')}
          size="lg"
          className="min-w-[200px] rounded-full font-medium"
        >
          Start Shopping
        </Button>
      </div>
    </div>
  );
};

export default Nowishlist;