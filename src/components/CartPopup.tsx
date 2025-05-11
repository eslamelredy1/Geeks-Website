import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { CartItem } from './ProductGrid';
import OrderForm from './OrderForm';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

interface CartPopupProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
  onOrderComplete: (orderDetails: {
    items: CartItem[];
    total: number;
    shippingInfo: {
      firstName: string;
      lastName: string;
      buildingNumber: string;
      streetName: string;
      city: string;
      country: string;
      phoneNumber: string;
    };
  }) => void;
}

const CartPopup: React.FC<CartPopupProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderComplete
}) => {
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = 50;

  const handleOrderComplete = (orderDetails: any) => {
    onOrderComplete(orderDetails);
    setOrderComplete(true);
    setShowOrderForm(false);
  };

  if (!isOpen) return null;

  if (orderComplete) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full text-center">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircleIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Order Completed Successfully!</h3>
            <p className="text-sm text-gray-500 mb-2">Thank you for your purchase.</p>
            <p className="text-sm text-gray-500 mb-4">Your order will be shipped within 2-5 days.</p>
          </div>
          <button
            onClick={() => {
              setOrderComplete(false);
              onClose();
            }}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 mt-2"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (showOrderForm) {
    return (
      <OrderForm
        cartItems={cartItems}
        totalPrice={totalPrice}
        onClose={() => setShowOrderForm(false)}
        onOrderComplete={handleOrderComplete}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Shopping Cart</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Your cart is empty</p>
        ) : (
          <>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-500">{item.price} EGP</p>
                    <p className="text-sm text-gray-600">Size: {item.size}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        +
                      </button>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 ml-4"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t mt-6 pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{totalPrice} EGP</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Shipping Fee:</span>
                <span className="font-medium">{shippingFee} EGP</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>{totalPrice + shippingFee} EGP</span>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={onClearCart}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Clear Cart
              </button>
              <button
                onClick={() => setShowOrderForm(true)}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
              >
                Buy Now
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPopup; 