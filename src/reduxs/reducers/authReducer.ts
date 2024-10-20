import { createSlice } from "@reduxjs/toolkit";
import { localDataNames } from "../../constants/appInfos";

export interface AuthState {
  token: string;
  _id: string;
  name: string;
  rule: string;
}
const initialState = {
  token: "",
  _id: "",
  name: "",
  rule: "",
};
const authSlice = createSlice({
  name: "auth",
  initialState: {
    data: initialState,
  },
  reducers: {
    addAuth(state, action) {
      state.data = action.payload;
    },
    removeAuth(state) {
      state.data = initialState;
      localStorage.removeItem(localDataNames.authData);
    },
  },
});

export const authReducer = authSlice.reducer;
export const { addAuth, removeAuth } = authSlice.actions;

export const authSeletor = (state: any) => state.authReducer.data;

const syncLocal = async (data: any) => {
  localStorage.setItem(localDataNames.authData, JSON.stringify(data));
};
