import {createSlice} from '@reduxjs/toolkit';

export const ProductInfoSlice = createSlice({
  name: 'productInfo',
  initialState: {
    name: '',
    category: '',
  },
  reducers: {
    setProductInfo: (state, action) => {
      state.name = action.payload.name;
      state.category = action.payload.category;
    },
    clearProductInfo: state => {
      state.name = '';
      state.category = '';
    },
  },
});

export const {setProductInfo, clearProductInfo} = ProductInfoSlice.actions;

export default ProductInfoSlice.reducer;
