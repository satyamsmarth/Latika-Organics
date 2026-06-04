import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({

 name: "cart",

 initialState: {
  items: []
 },

 reducers: {

  addToCart: (state, action) => {

   state.items = state.items || [];

   const existing = state.items.find(
    item => item.id === action.payload.id
   );

   if(existing){

    existing.quantity += 1;

   } else {

    state.items.push({
     ...action.payload,
     quantity: 1
    });

   }

  },

  increaseQty: (state, action) => {

   const item = state.items.find(
    i => i.id === action.payload
   );

   if(item){
    item.quantity += 1;
   }

  },

  decreaseQty: (state, action) => {

   const item = state.items.find(
    i => i.id === action.payload
   );

   if(item){

    if(item.quantity > 1){
     item.quantity -= 1;
    }

   }

  },

  removeFromCart: (state, action) => {

   state.items = state.items.filter(
    item => item.id !== action.payload
   );

  },

  /* NEW ACTION — CLEARS CART AFTER ORDER */

  clearCart: (state) => {

   state.items = [];

  }

 }

});

export const {
 addToCart,
 increaseQty,
 decreaseQty,
 removeFromCart,
 clearCart
} = cartSlice.actions;

export default cartSlice.reducer;