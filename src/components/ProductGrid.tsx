import React, { useState, useMemo } from 'react';
import SizeSelector from './SizeSelector';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  type: string;
  gender: string;
}

const SORT_OPTIONS = [
  { value: 'a-z', label: 'Name: A to Z' },
  { value: 'z-a', label: 'Name: Z to A' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' }
];

const products: Product[] = [
  {
    id: 1,
    name: 'Pocket Cargo',
    price: 1200,
    image: 'https://gonative.eg/cdn/shop/files/CCxGN-46_181d55b3-80ff-4775-812d-f69eb46cb89e.jpg?v=1733926115&width=1000',
    type: 'Pants',
    gender: 'Male'
  },
  {
    id: 2,
    name: 'Knitted Pants',
    price: 800,
    image: 'https://gonative.eg/cdn/shop/files/CCxGN-234.jpg?v=1742565793&width=300',
    type: 'Pants',
    gender: 'Male'
  },
  {
    id: 3,
    name: 'Knitted Quarter-Zipper Sweater',
    price: 1500,
    image: 'https://gonative.eg/cdn/shop/files/CCxGN-234_f5c3df22-d0a9-4c13-b5db-ab412ab183fc.jpg?v=1733920256&width=300',
    type: 'Sweater',
    gender: 'Male'
  },
  {
    id: 4,
    name: 'Twenty Seven Sweater',
    price: 1800,
    image: 'https://gonative.eg/cdn/shop/files/CCxGN-42.jpg?v=1733925822&width=300',
    type: 'Sweater',
    gender: 'Male'
  },
  {
    id: 5,
    name: 'Classic T-Shirt',
    price: 400,
    image: 'https://swettailor.com/cdn/shop/products/ST_0004s_0001_BLACKSOFTESTTEE-FRONT.jpg?v=1619189065',
    type: 'T-Shirt',
    gender: 'Unisex'
  },
  {
    id: 6,
    name: 'Sport Shorts',
    price: 600,
    image: 'https://eg.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/62/572742/1.jpg?3408',
    type: 'Shorts',
    gender: 'Male'
  },
  {
    id: 7,
    name: 'Running Shoes',
    price: 2400,
    image: 'https://runkeeper.com/cms/wp-content/uploads/sites/4/2021/04/SS23_GEL-CUMULUS-25_Highlight_CHIASI0016_SH09_03_FINAL.jpg',
    type: 'Shoes',
    gender: 'Male'
  },
  {
    id: 8,
    name: 'Denim Jacket',
    price: 2000,
    image: 'https://gonative.eg/cdn/shop/files/CCxEdited-81.jpg?v=1732025262&width=800',
    type: 'Jackets',
    gender: 'Female'
  },
  {
    id: 9,
    name: 'V-Neck T-Shirt',
    price: 450,
    image: 'https://m.media-amazon.com/images/I/71Qxh4rULYL.AC_SL1500.jpg',
    type: 'T-Shirt',
    gender: 'Unisex'
  },
  {
    id: 10,
    name: 'Cargo Shorts',
    price: 700,
    image: 'https://xcdn.next.co.uk/common/items/default/default/itemimages/3_4Ratio/product/lge/M74181s.jpg?im=Resize,width=750',
    type: 'Shorts',
    gender: 'Male'
  },
  {
    id: 11,
    name: 'Canvas Sneakers',
    price: 1200,
    image: 'https://m.media-amazon.com/images/I/41+A+aTE7-L.AC_SY580.jpg',
    type: 'Shoes',
    gender: 'Unisex'
  },
  {
    id: 12,
    name: 'Bomber Jacket',
    price: 2200,
    image: 'https://gonative.eg/cdn/shop/files/CCxGN-225_dc204ab2-f90c-4918-acac-df7a0d5aafa9.jpg?v=1740403471&width=800',
    type: 'Jackets',
    gender: 'Female'
  }
];

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  type: string;
  gender: string;
  quantity: number;
  size: string;
}

interface ProductGridProps {
  cartItems: CartItem[];
  onAddToCart: (product: Omit<CartItem, 'quantity'>) => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  searchQuery: string;
  filters: {
    priceRange: [number, number];
    productType: string[];
    gender: string[];
  };
}

const ProductGrid: React.FC<ProductGridProps> = ({
  cartItems,
  onAddToCart,
  onUpdateQuantity,
  onRemoveItem,
  searchQuery,
  filters
}) => {
  const [sortOption, setSortOption] = useState('a-z');
  const [selectedProduct, setSelectedProduct] = useState<Omit<CartItem, 'quantity' | 'size'> | null>(null);
  const [showSizeSelector, setShowSizeSelector] = useState(false);

  const handleAddToCartClick = (product: Omit<CartItem, 'quantity' | 'size'>) => {
    setSelectedProduct(product);
    setShowSizeSelector(true);
  };

  const handleSizeSelect = (size: string) => {
    if (selectedProduct) {
      onAddToCart({ ...selectedProduct, size });
      setShowSizeSelector(false);
      setSelectedProduct(null);
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesPrice = product.price >= filters.priceRange[0] && 
                          product.price <= filters.priceRange[1];
      const matchesType = filters.productType.length === 0 || 
                         filters.productType.includes(product.type);
      const matchesGender = filters.gender.length === 0 || 
                           filters.gender.includes(product.gender);
      const matchesSearch = product.name.toLowerCase()
                                    .includes(searchQuery.toLowerCase());
      
      return matchesPrice && matchesType && matchesGender && matchesSearch;
    });

    switch (sortOption) {
      case 'a-z':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'z-a':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-low-high':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        // Default to A-Z sorting
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [filters, sortOption, searchQuery]);

  return (
    <div className="flex-1 p-6">
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-500">
          {filteredAndSortedProducts.length} products found
        </p>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {filteredAndSortedProducts.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          No products found matching your criteria
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedProducts.map((product) => (
            <div key={product.id} className="group relative">
              <div className="aspect-w-4 aspect-h-5 overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover object-center"
                />
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{product.price} EGP</p>
                    {product.originalPrice && (
                      <p className="text-sm text-gray-500 line-through">
                        {product.originalPrice} EGP
                      </p>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => handleAddToCartClick(product)}
                  className="w-full py-2 px-4 rounded-md transition-all transform hover:scale-105 bg-black text-white hover:bg-orange-500"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedProduct && (
        <SizeSelector
          isOpen={showSizeSelector}
          onClose={() => {
            setShowSizeSelector(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
          onSizeSelect={handleSizeSelect}
        />
      )}
    </div>
  );
};

export default ProductGrid; 