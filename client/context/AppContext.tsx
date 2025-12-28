import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Vendor, OrderItem, Order, MenuItem, generateOrderNumber } from "@/data/mockData";

interface AppState {
  selectedVendor: Vendor | null;
  cart: OrderItem[];
  orders: Order[];
  currentOrder: Order | null;
}

interface AppContextType extends AppState {
  selectVendor: (vendor: Vendor) => void;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  getItemQuantity: (itemId: string) => number;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  clearCart: () => void;
  placeOrder: (pickupTime: string) => Order;
  clearCurrentOrder: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    selectedVendor: null,
    cart: [],
    orders: [],
    currentOrder: null,
  });

  const selectVendor = useCallback((vendor: Vendor) => {
    setState((prev) => ({
      ...prev,
      selectedVendor: vendor,
      cart: [],
    }));
  }, []);

  const addToCart = useCallback((item: MenuItem) => {
    setState((prev) => {
      const existingIndex = prev.cart.findIndex((ci) => ci.menuItem.id === item.id);
      if (existingIndex >= 0) {
        const newCart = [...prev.cart];
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newCart[existingIndex].quantity + 1,
        };
        return { ...prev, cart: newCart };
      }
      return { ...prev, cart: [...prev.cart, { menuItem: item, quantity: 1 }] };
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setState((prev) => {
      const existingIndex = prev.cart.findIndex((ci) => ci.menuItem.id === itemId);
      if (existingIndex >= 0) {
        const newCart = [...prev.cart];
        if (newCart[existingIndex].quantity > 1) {
          newCart[existingIndex] = {
            ...newCart[existingIndex],
            quantity: newCart[existingIndex].quantity - 1,
          };
        } else {
          newCart.splice(existingIndex, 1);
        }
        return { ...prev, cart: newCart };
      }
      return prev;
    });
  }, []);

  const getItemQuantity = useCallback(
    (itemId: string) => {
      const item = state.cart.find((ci) => ci.menuItem.id === itemId);
      return item ? item.quantity : 0;
    },
    [state.cart]
  );

  const getCartTotal = useCallback(() => {
    return state.cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  }, [state.cart]);

  const getCartItemCount = useCallback(() => {
    return state.cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [state.cart]);

  const clearCart = useCallback(() => {
    setState((prev) => ({ ...prev, cart: [], selectedVendor: null }));
  }, []);

  const placeOrder = useCallback(
    (pickupTime: string): Order => {
      const order: Order = {
        id: Date.now().toString(),
        orderNumber: generateOrderNumber(),
        vendor: state.selectedVendor!,
        items: [...state.cart],
        pickupTime,
        total: getCartTotal(),
        status: "Pending",
        createdAt: new Date(),
      };

      setState((prev) => ({
        ...prev,
        orders: [order, ...prev.orders],
        currentOrder: order,
        cart: [],
        selectedVendor: null,
      }));

      return order;
    },
    [state.selectedVendor, state.cart, getCartTotal]
  );

  const clearCurrentOrder = useCallback(() => {
    setState((prev) => ({ ...prev, currentOrder: null }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        selectVendor,
        addToCart,
        removeFromCart,
        getItemQuantity,
        getCartTotal,
        getCartItemCount,
        clearCart,
        placeOrder,
        clearCurrentOrder,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
