import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface SizeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    type: string;
    gender: string;
  };
  onSizeSelect: (size: string) => void;
}

const SizeSelector: React.FC<SizeSelectorProps> = ({
  isOpen,
  onClose,
  product,
  onSizeSelect
}) => {
  const getSizeOptions = (): string[] => {
    switch (product.type.toLowerCase()) {
      case 't-shirt':
        return ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
      case 'jackets':
        return ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
      case 'sweater':
        return ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
      case 'shorts':
        return ['32', '34', '36', '38', '40', '42', '44', '46', '48', '50', '52', '54', '56', '58'];
      case 'pants':
        return ['32', '34', '36', '38', '40', '42', '44', '46', '48', '50', '52', '54', '56', '58'];
      case 'shoes':
        return ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47'];
      default:
        return ['S', 'M', 'L', 'XL'];
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Select Size</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-32 h-32 object-cover rounded mx-auto"
          />
          <h3 className="text-lg font-medium mt-2 text-center">{product.name}</h3>
          <p className="text-gray-600 text-center">{product.price} EGP</p>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {getSizeOptions().map((size) => (
            <button
              key={size}
              onClick={() => onSizeSelect(size)}
              className="p-3 border rounded-md hover:border-orange-500 hover:bg-orange-50 transition-colors"
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SizeSelector; 