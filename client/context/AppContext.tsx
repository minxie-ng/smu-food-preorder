import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Vendor, OrderItem, Order, MenuItem, generateOrderNumber } from "@/data/mockData";

interface AppState {
  selectedVendor: Vendor | null;
  cart: OrderItem[];
  orders: Order[];
  currentOrder: Order | null;
  needsCutlery: boolean;
  orderNote: string;
  takeOut: boolean;
  pickupTime: string | null;
}

interface AppContextType extends AppState {
  selectVendor: (vendor: Vendor) => void;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  getItemQuantity: (itemId: string) => number;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  clearCart: () => void;
  setNeedsCutlery: (value: boolean) => void;
  setOrderNote: (note: string) => void;
  setTakeOut: (value: boolean) => void;
  setPickupTime: (time: string) => void;
  placeOrder: () => Order;
  clearCurrentOrder: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    selectedVendor: null,
    cart: [],
    orders: [],
    currentOrder: null,
    needsCutlery: true,
    orderNote: "",
    takeOut: false,
    pickupTime: null,
  });

  const selectVendor = useCallback((vendor: Vendor) => {
    setState((prev) => ({
      ...prev,
      selectedVendor: vendor,
      cart: [],
      needsCutlery: true,
      orderNote: "",
      takeOut: false,
      pickupTime: null,
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
    setState((prev) => ({
      ...prev,
      cart: [],
      selectedVendor: null,
      needsCutlery: true,
      orderNote: "",
      takeOut: false,
      pickupTime: null,
    }));
  }, []);

  const setNeedsCutlery = useCallback((value: boolean) => {
    setState((prev) => ({ ...prev, needsCutlery: value }));
  }, []);

  const setOrderNote = useCallback((note: string) => {
    setState((prev) => ({ ...prev, orderNote: note }));
  }, []);

  const setTakeOut = useCallback((value: boolean) => {
    setState((prev) => ({ ...prev, takeOut: value }));
  }, []);

  const setPickupTime = useCallback((time: string) => {
    setState((prev) => ({ ...prev, pickupTime: time }));
  }, []);

  const placeOrder = useCallback((): Order => {
    const order: Order = {
      id: Date.now().toString(),
      orderNumber: generateOrderNumber(),
      vendor: state.selectedVendor!,
      items: [...state.cart],
      pickupTime: state.pickupTime || "Now",
      total: getCartTotal(),
      status: "Pending",
      createdAt: new Date(),
      needsCutlery: state.needsCutlery,
      orderNote: state.orderNote,
      takeOut: state.takeOut,
    };

    setState((prev) => ({
      ...prev,
      orders: [order, ...prev.orders],
      currentOrder: order,
      cart: [],
      selectedVendor: null,
      needsCutlery: true,
      orderNote: "",
      takeOut: false,
      pickupTime: null,
    }));

    return order;
  }, [state.selectedVendor, state.cart, state.pickupTime, state.needsCutlery, state.orderNote, state.takeOut, getCartTotal]);

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
        setNeedsCutlery,
        setOrderNote,
        setTakeOut,
        setPickupTime,
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
