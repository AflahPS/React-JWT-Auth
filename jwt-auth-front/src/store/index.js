import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./authSlice";
import tokenSlice from "./tokenSlice";
import userSlice from "./userSlice";
import allUsersSlice from "./allUsersSlice";

const store = configureStore({
  reducer: {
    auth: AuthSlice.reducer,
    jwt: tokenSlice.reducer,
    user: userSlice.reducer,
    allUsers: allUsersSlice.reducer,
  },
});

export default store;
