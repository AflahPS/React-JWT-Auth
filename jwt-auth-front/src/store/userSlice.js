import { createSlice } from "@reduxjs/toolkit";

const initialState = { userData: null };

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userData = action.payload;
    },
    unSetUser: (state) => {
      state.userData = null;
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice;
