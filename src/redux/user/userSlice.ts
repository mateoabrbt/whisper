import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '@redux/store';

interface UserState {
  status: Status;
  user: User | undefined;
  session: Session | undefined;
}

const initialState: UserState = {
  user: undefined,
  status: 'loading',
  session: undefined,
};

export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    updateStatus: (state, action: PayloadAction<Status>) => {
      state.status = action.payload;
    },
    updateUser: (state, action: PayloadAction<User | undefined>) => {
      state.user = action.payload;
    },
    updateSession: (state, action: PayloadAction<Session | undefined>) => {
      state.session = action.payload;
    },
  },
});

export const { updateUser, updateStatus, updateSession } = userSlice.actions;

export const selectUserState = (state: RootState) => state.user;

export default userSlice.reducer;
