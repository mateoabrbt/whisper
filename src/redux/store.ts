/* eslint-disable import/no-named-as-default */
import { configureStore } from "@reduxjs/toolkit";

import userSlice from "./user/userSlice";

export const Store = configureStore({
  reducer: {
    user: userSlice,
  },
});

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
