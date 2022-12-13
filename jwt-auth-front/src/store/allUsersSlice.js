import { createSlice } from "@reduxjs/toolkit";

const initialState = { users: [] };

const allUsersSlice = createSlice({
  name: "allUsers",
  initialState,
  reducers: {
    setAllUsers: (state, action) => {
      state.users = action.payload;
    },
    unSetAllUsers: (state) => {
      state.users = null;
    },
  },
});

export const allUsersActions = allUsersSlice.actions;

export default allUsersSlice;
