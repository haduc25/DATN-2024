import {createSlice} from '@reduxjs/toolkit';

export const CartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: [],
    isClean: false,
  },
  reducers: {
    addToCart: (state, action) => {
      state.isClean = false;
      const itemPresent = state.cart.find(
        item => item.id === action.payload.id,
      );

      if (itemPresent) {
        itemPresent.quantity++;
      } else {
        state.cart.push({...action.payload, quantity: 1});
      }
    },
    removeFromCart: (state, action) => {
      // state.isClean = true;
      state.isClean = false;
      const removeItem = state.cart.filter(
        item => item.id !== action.payload.id,
      );
      state.cart = removeItem;
    },
    incrementQuantity: (state, action) => {
      state.isClean = false;
      const itemPresent = state.cart.find(
        item => item.id === action.payload.id,
      );
      if (itemPresent) {
        itemPresent.quantity++;
      }
    },
    decrementQuantity: (state, action) => {
      state.isClean = false;
      const itemPresent = state.cart.find(
        item => item.id === action.payload.id,
      );
      if (itemPresent) {
        if (itemPresent.quantity === 1) {
          state.cart = state.cart.filter(item => item.id !== action.payload.id);
          state.isClean = true;
          console.log('CLEAN');
        } else {
          itemPresent.quantity--;
          console.log('itemPresent: ', itemPresent);
          console.log('Decrement: ', itemPresent.quantity, state.cart);
        }
      }
    },
    cleanQuantity: (state, action) => {
      state.isClean = false;
      const itemPresent = state.cart.find(
        item => item.id === action.payload.id,
      );
      if (itemPresent) {
        if (itemPresent.quantity) {
          state.cart = state.cart.filter(item => item.id !== action.payload.id);
          state.isClean = true;
        }
      }
    },
    cleanCart: state => {
      state.cart = [];
      state.isClean = true;
    },
    cleanCartUI: state => {
      state.isClean = true;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  cleanQuantity,
  cleanCart,
  cleanCartUI,
} = CartSlice.actions;

export default CartSlice.reducer;
