import React, { useEffect, useState } from 'react';
import { CartItem } from './ProductGrid';
import { Order, loadOrders } from '../utils/orderManager';

interface AdminDashboardProps {
  orders: Order[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveOrder: (orderId: string) => void;
  onRemoveAllOrders: () => void;
}

interface OrderDetailsPopupProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailsPopup: React.FC<{
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}> = ({ order, isOpen, onClose }) => {
  if (!isOpen) return null;

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = 50;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Order Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Name</p>
                <p className="font-medium">{order.shippingInfo.firstName} {order.shippingInfo.lastName}</p>
              </div>
              <div>
                <p className="text-gray-600">Phone</p>
                <p className="font-medium">{order.shippingInfo.phoneNumber}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600">Address</p>
                <p className="font-medium">
                  {order.shippingInfo.buildingNumber} {order.shippingInfo.streetName}, {order.shippingInfo.city}, {order.shippingInfo.country}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Order Items</h3>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Size: {item.size}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-medium">{item.price * item.quantity} EGP</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{subtotal} EGP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping Fee:</span>
                <span className="font-medium">{shippingFee} EGP</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>{order.total} EGP</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Payment Method:</span>
                <span>Cash on Delivery (COD)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  orders, 
  isOpen, 
  onClose,
  onRemoveOrder,
  onRemoveAllOrders 
}) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [localOrders, setLocalOrders] = useState<Order[]>([]);

  // Load orders when dashboard opens or when orders prop changes
  useEffect(() => {
    if (isOpen) {
      console.log('=== AdminDashboard opened ===');
      // Load orders directly from localStorage
      const loadedOrders = loadOrders();
      console.log('Loaded orders from localStorage:', loadedOrders);
      setLocalOrders(loadedOrders);
      console.log('=== End AdminDashboard open ===');
    }
  }, [isOpen, orders]); // Add orders as a dependency

  const handleViewDetails = (order: Order) => {
    console.log('Viewing order details:', order);
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handleRemoveOrder = (orderId: string) => {
    onRemoveOrder(orderId);
    // Update localOrders immediately
    setLocalOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
  };

  const handleRemoveAllOrders = () => {
    onRemoveAllOrders();
    // Update localOrders immediately
    setLocalOrders([]);
  };

  // Format order number to be sequential (e.g., 000001)
  const formatOrderNumber = (orderId: string) => {
    // Extract the number from the order ID (e.g., "ORD-000001" -> "000001")
    const number = orderId.split('-')[1];
    return `Order #${number}`;
  };

  if (!isOpen) return null;

  // Sort orders by order number (ascending) to maintain sequential display
  const sortedOrders = [...localOrders].sort((a, b) => {
    const numA = parseInt(a.id.split('-')[1]);
    const numB = parseInt(b.id.split('-')[1]);
    return numA - numB;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRemoveAllOrders}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Remove All Orders
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {sortedOrders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No orders found</p>
            <p className="text-gray-400 text-sm mt-2">Orders will appear here once customers place them</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedOrders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{formatOrderNumber(order.id)}</p>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold">{order.total} EGP</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleRemoveOrder(order.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedOrder && (
          <OrderDetailsPopup
            order={selectedOrder}
            isOpen={isDetailsOpen}
            onClose={() => {
              setIsDetailsOpen(false);
              setSelectedOrder(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 