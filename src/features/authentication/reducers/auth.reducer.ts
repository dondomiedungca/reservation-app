import type { RootState } from "@/store";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export interface Auth {
  user: { id: number; email: string; firstName: string } | undefined;
}

const initialState: Auth = { user: undefined };

export const counterSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = undefined;
    },
    setUser: (state, action: PayloadAction<Auth["user"]>) => {
      state.user = action.payload;
    },
  },
});

export const { logout, setUser } = counterSlice.actions;

export const selectAuth = (state: RootState) => state.authReducer;

export default counterSlice.reducer;
