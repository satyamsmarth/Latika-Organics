import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";

const loadCart = () => {
  try {
    const saved = localStorage.getItem("cart");

    if (!saved) return { items: [] };

    const parsed = JSON.parse(saved);

    return {
      items: parsed.items || []
    };

  } catch {
    return { items: [] };
  }
};

const saveCart = (state) => {
  try {
    localStorage.setItem("cart", JSON.stringify(state.cart));
  } catch {}
};

export const store = configureStore({
  reducer: {
    cart: cartReducer
  },
  preloadedState: {
    cart: loadCart()
  }
});

store.subscribe(() => {
  saveCart(store.getState());
});