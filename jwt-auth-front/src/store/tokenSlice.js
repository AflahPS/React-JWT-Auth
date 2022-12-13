import { createSlice } from "@reduxjs/toolkit";

const initialState = { token: "" };

const tokenSlice = createSlice({
  name: "jwt",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const tokenActions = tokenSlice.actions;

export default tokenSlice;
