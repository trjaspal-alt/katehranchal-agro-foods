import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductPackOption, OrderRecord, ShippingAddress, ProductVariation } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, selectedPack: ProductPackOption, quantity?: number) => boolean;
  canAddToCart: (product: Product, selectedPack?: ProductPackOption | ProductVariation) => boolean;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQty: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  estimatedTaxes: number;
  estimatedShipping: number;
  discountAmount: number;
  totalAmount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  activeCoupon: string | null;
  couponMessage: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  // Order state & management
  currentOrder: OrderRecord | null;
  createOrder: (address: ShippingAddress, paymentMethod: string) => OrderRecord;
  pastOrders: OrderRecord[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'katehranchal_cart_v2';
const ORDERS_STORAGE_KEY = 'katehranchal_orders_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (!saved) return [];
      const parsed: CartItem[] = JSON.parse(saved);
      // Strict safeguard: Filter out any items with missing or zero unit price
      return Array.isArray(parsed)
        ? parsed.filter((item) => typeof item.unitPrice === 'number' && item.unitPrice > 0)
        : [];
    } catch {
      return [];
    }
  });

  const [pastOrders, setPastOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentOrder, setCurrentOrder] = useState<OrderRecord | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCoupon, setActiveCoupon] = useState<string | null>(null);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // safe fallback
    }
  }, [cart]);

  // Sync past orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(pastOrders));
    } catch {
      // safe fallback
    }
  }, [pastOrders]);

  const canAddToCart = (product: Product, selectedPack?: ProductPackOption | ProductVariation): boolean => {
    if (!product || product.productStatus !== 'available') return false;
    if (!selectedPack) return false;
    const price = 'unitPrice' in selectedPack ? selectedPack.unitPrice : selectedPack.price;
    return typeof price === 'number' && price > 0;
  };

  const addToCart = (product: Product, selectedPack: ProductPackOption, quantity = 1): boolean => {
    // Strict safeguard: Verify eligibility before permitting addition to cart
    if (!canAddToCart(product, selectedPack)) {
      console.warn(
        `[Cart Safeguard] Product "${product.name}" cannot be added to cart until commercial specifications (price, SKU, pack size) are verified.`
      );
      return false;
    }

    if (typeof selectedPack.unitPrice !== 'number' || selectedPack.unitPrice <= 0) {
      return false;
    }

    const safeQty = Math.min(Math.max(1, quantity), 10);

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.packOption.id === selectedPack.id
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = Math.min(updated[existingIndex].quantity + safeQty, 10);
        updated[existingIndex].quantity = newQty;
        return updated;
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${selectedPack.id}`,
          productId: product.id,
          name: product.name,
          slug: product.slug,
          packOption: selectedPack,
          quantity: safeQty,
          unitPrice: selectedPack.unitPrice as number,
          primaryImage: product.primaryImage,
        };
        return [...prev, newItem];
      }
    });

    setIsCartOpen(true);
    return true;
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    const safeQty = Math.min(newQty, 10);
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity: safeQty } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setActiveCoupon(null);
    setCouponMessage(null);
  };

  const applyCoupon = (code: string): boolean => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return false;
    
    // In accordance with Step 5 commercial rules: All coupon validation occurs on server and coupons remain disabled until official release
    setActiveCoupon(null);
    setCouponMessage('Promotional coupons are currently inactive pending official launch campaign announcement.');
    return false;
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
    setCouponMessage(null);
  };

  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  // Baseline tax demonstration (calculated dynamically based on available items)
  // Tax is calculated by the server after the applicable product classification
  // and business registration are verified. Do not guess a storefront rate.
  const estimatedTaxes = 0;

  // Shipping calculation state (unconfigured until courier rate contract is finalized)
  const estimatedShipping = 0;

  const discountAmount = 0;

  const totalAmount = Math.max(0, subtotal + estimatedTaxes + estimatedShipping - discountAmount);

  const createOrder = (address: ShippingAddress, paymentMethod: string): OrderRecord => {
    const orderNumber = `KAF-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
    const newOrder: OrderRecord = {
      orderId: `ord_${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: [...cart],
      subtotal,
      taxAmount: estimatedTaxes,
      deliveryCharge: estimatedShipping,
      totalAmount,
      currency: 'INR',
      shippingAddress: address,
      billingAddress: address,
      paymentMethod,
      paymentProvider: 'test_gateway',
      paymentStatus: 'Pending',
      deliveryStatus: 'Order Received',
      isTestOrder: true,
      history: [
        {
          timestamp: new Date().toISOString(),
          status: 'Order Received / Pending',
          note: 'Order initiated at customer checkout.',
        },
      ],
    };

    setCurrentOrder(newOrder);
    setPastOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        canAddToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        estimatedTaxes,
        estimatedShipping,
        discountAmount,
        totalAmount,
        isCartOpen,
        setIsCartOpen,
        activeCoupon,
        couponMessage,
        applyCoupon,
        removeCoupon,
        currentOrder,
        createOrder,
        pastOrders,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
