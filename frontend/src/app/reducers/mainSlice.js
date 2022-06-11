import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    // allRestList: [],
};


export const mainSlice = createSlice({
  name: 'main',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // onCustomerSignup: (state, action) => {
    //   state.customerSignupSuccessMsg= action.payload?.msg;
    // },
    
  },
});

// eslint-disable-next-line no-empty-pattern
export const {
    //  onCustomerSignup 
 } = mainSlice.actions;


export default mainSlice.reducer;
