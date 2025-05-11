import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ProductGrid from './components/ProductGrid';
import CartPopup from './components/CartPopup';
import SearchBar from './components/SearchBar';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { CartItem } from './components/ProductGrid';
import { Order, loadOrders, placeOrder } from './utils/orderManager';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    priceRange: [0, 2400] as [number, number],
    productType: [] as string[],
    gender: [] as string[]
  });

  // Load orders on component mount
  useEffect(() => {
    console.log('=== App mounted, loading orders ===');
    const loadedOrders = loadOrders();
    console.log('Loaded orders from storage:', loadedOrders);
    setOrders(loadedOrders);
    console.log('Orders state updated:', loadedOrders);
    console.log('=== End order loading ===');
  }, []);

  const handleAddToCart = (product: Omit<CartItem, 'quantity'>) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const handleRemoveItem = (productId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleFiltersChange = (newFilters: {
    priceRange: [number, number];
    productType: string[];
    gender: string[];
  }) => {
    setFilters(newFilters);
  };

  const handleOrderComplete = (orderDetails: {
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
  }) => {
    console.log('=== Starting order completion ===');
    console.log('Order details:', orderDetails);
    
    // Create and save the new order
    const newOrder = placeOrder(orderDetails.items, orderDetails.shippingInfo);
    console.log('New order created:', newOrder);
    
    // Update the orders state
    setOrders(prevOrders => {
      const updatedOrders = [...prevOrders, newOrder];
      console.log('Updated orders state:', updatedOrders);
      return updatedOrders;
    });
    
    // Clear cart and close popup
    setCartItems([]);
    setIsCartOpen(false);
    console.log('=== End order completion ===');
  };

  const handleRemoveOrder = (orderId: string) => {
    console.log('=== Removing order ===');
    console.log('Order ID to remove:', orderId);
    
    // Remove the order from localStorage
    const updatedOrders = orders.filter(order => order.id !== orderId);
    localStorage.setItem('geeks_orders', JSON.stringify(updatedOrders));
    
    // Update the orders state
    setOrders(updatedOrders);
    console.log('Order removed successfully');
    console.log('=== End order removal ===');
  };

  const handleRemoveAllOrders = () => {
    console.log('=== Removing all orders ===');
    
    // Clear all orders from localStorage
    localStorage.removeItem('geeks_orders');
    
    // Update the orders state
    setOrders([]);
    console.log('All orders removed successfully');
    console.log('=== End all orders removal ===');
  };

  const handleAdminLogin = () => {
    console.log('=== Admin logging in ===');
    // Load fresh orders from localStorage
    const latestOrders = loadOrders();
    console.log('Latest orders loaded:', latestOrders);
    setOrders(latestOrders);
    console.log('Orders state updated:', latestOrders);
    setIsAdminLoginOpen(false);
    setIsAdminDashboardOpen(true);
    console.log('=== End admin login ===');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartItems={cartItems}
        onCartClick={() => setIsCartOpen(true)}
        onSearchChange={setSearchQuery}
        onAdminClick={() => setIsAdminLoginOpen(true)}
        searchQuery={searchQuery}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <Sidebar onFiltersChange={handleFiltersChange} />
          <ProductGrid
            cartItems={cartItems}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            searchQuery={searchQuery}
            filters={filters}
          />
        </div>
      </div>
      <CartPopup
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onOrderComplete={handleOrderComplete}
      />
      <AdminLogin
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLogin={handleAdminLogin}
      />
      <AdminDashboard
        orders={orders}
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        onRemoveOrder={handleRemoveOrder}
        onRemoveAllOrders={handleRemoveAllOrders}
      />
    </div>
  );
}

export default App;
