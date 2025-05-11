import { CartItem } from '../components/ProductGrid';

export interface Order {
  id: string;
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
  date: string;
}

const STORAGE_KEY = 'geeks_orders';

const validateOrder = (order: any): order is Order => {
  try {
    const isValid = (
      order &&
      typeof order === 'object' &&
      typeof order.id === 'string' &&
      Array.isArray(order.items) &&
      typeof order.total === 'number' &&
      order.shippingInfo &&
      typeof order.shippingInfo === 'object' &&
      typeof order.shippingInfo.firstName === 'string' &&
      typeof order.shippingInfo.lastName === 'string' &&
      typeof order.shippingInfo.buildingNumber === 'string' &&
      typeof order.shippingInfo.streetName === 'string' &&
      typeof order.shippingInfo.city === 'string' &&
      typeof order.shippingInfo.country === 'string' &&
      typeof order.shippingInfo.phoneNumber === 'string' &&
      typeof order.date === 'string'
    );

    if (!isValid) {
      console.error('Order validation failed:', order);
    }
    return isValid;
  } catch (error) {
    console.error('Error validating order:', error);
    return false;
  }
};

export const saveOrder = (order: Order): void => {
  try {
    console.log('Attempting to save order:', order);
    
    // Validate order before saving
    if (!validateOrder(order)) {
      console.error('Invalid order data, not saving:', order);
      return;
    }

    // Get existing orders
    const existingOrders = loadOrders();
    console.log('Existing orders before save:', existingOrders);

    // Add new order
    const updatedOrders = [...existingOrders, order];
    console.log('Updated orders to save:', updatedOrders);

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOrders));
    
    // Verify save was successful
    const savedOrders = loadOrders();
    console.log('Verified saved orders:', savedOrders);
    
    if (savedOrders.length !== updatedOrders.length) {
      console.error('Order save verification failed');
      // Try to recover by saving again
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOrders));
    }
  } catch (error) {
    console.error('Error saving order:', error);
    // Try to recover by saving just the new order
    try {
      const currentOrders = loadOrders();
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...currentOrders, order]));
    } catch (recoveryError) {
      console.error('Failed to recover order save:', recoveryError);
    }
  }
};

export const loadOrders = (): Order[] => {
  try {
    console.log('Loading orders from localStorage...');
    
    // Get raw data from localStorage
    const savedOrders = localStorage.getItem(STORAGE_KEY);
    console.log('Raw localStorage data:', savedOrders);

    if (!savedOrders) {
      console.log('No orders found in localStorage');
      return [];
    }

    // Parse the JSON data
    const parsedOrders = JSON.parse(savedOrders);
    console.log('Parsed orders:', parsedOrders);

    // Ensure we have an array
    if (!Array.isArray(parsedOrders)) {
      console.error('Parsed orders is not an array:', parsedOrders);
      return [];
    }

    // Validate and clean up orders
    const validOrders = parsedOrders.filter((order: any) => {
      const isValid = validateOrder(order);
      if (!isValid) {
        console.error('Invalid order found:', order);
      }
      return isValid;
    });

    console.log('Valid orders after filtering:', validOrders);
    return validOrders;
  } catch (error) {
    console.error('Error loading orders:', error);
    // Don't clear localStorage on error, just return empty array
    return [];
  }
};

export const placeOrder = (cartItems: CartItem[], shippingInfo: Order['shippingInfo']): Order => {
  console.log('=== Starting placeOrder ===');
  console.log('Input cartItems:', cartItems);
  console.log('Input shippingInfo:', shippingInfo);
  
  // Calculate total price including shipping fee
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + 50; // Add 50 EGP shipping fee
  console.log('Calculated total:', total);

  // Get existing orders to determine next order number
  const existingOrders = loadOrders();
  const nextOrderNumber = existingOrders.length + 1;

  // Create new order
  const newOrder: Order = {
    id: `ORD-${String(nextOrderNumber).padStart(6, '0')}`,
    items: cartItems,
    total,
    shippingInfo: {
      firstName: shippingInfo.firstName,
      lastName: shippingInfo.lastName,
      buildingNumber: shippingInfo.buildingNumber,
      streetName: shippingInfo.streetName,
      city: shippingInfo.city,
      country: shippingInfo.country,
      phoneNumber: shippingInfo.phoneNumber
    },
    date: new Date().toLocaleString()
  };
  console.log('Created new order:', newOrder);

  // Save the order
  console.log('Attempting to save order...');
  saveOrder(newOrder);
  console.log('Order saved successfully');
  
  // Verify the order was saved
  const savedOrders = loadOrders();
  console.log('Current orders in storage:', savedOrders);
  console.log('=== End placeOrder ===');
  
  return newOrder;
};

// Add test function to verify storage
export const testOrderStorage = () => {
  console.log('=== Testing Order Storage ===');
  
  // Clear existing orders
  localStorage.removeItem(STORAGE_KEY);
  console.log('Cleared existing orders');
  
  // Create a test order
  const testOrder: Order = {
    id: 'TEST-001',
    items: [
      {
        id: 1,
        name: 'Test Product',
        price: 100,
        image: 'test.jpg',
        type: 'T-Shirt',
        gender: 'Male',
        quantity: 1,
        size: 'M'
      }
    ],
    total: 150, // 100 + 50 shipping
    shippingInfo: {
      firstName: 'Test',
      lastName: 'User',
      buildingNumber: '123',
      streetName: 'Test Street',
      city: 'Test City',
      country: 'Test Country',
      phoneNumber: '01234567890'
    },
    date: new Date().toLocaleString()
  };
  
  // Save test order
  saveOrder(testOrder);
  console.log('Saved test order');
  
  // Load and verify
  const loadedOrders = loadOrders();
  console.log('Loaded orders after test:', loadedOrders);
  
  if (loadedOrders.length === 1 && loadedOrders[0].id === 'TEST-001') {
    console.log('Test successful: Order was saved and loaded correctly');
  } else {
    console.error('Test failed: Order was not saved or loaded correctly');
  }
  
  console.log('=== End Test ===');
}; 