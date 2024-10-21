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
      syncLocal(action.payload);
    },
    removeAuth: (state) => {
      state.data = initialState;
      syncLocal({});
    },
    refreshtoken: (state, action) => {
      state.data.token = action.payload;
    },
  },
});

export const authReducer = authSlice.reducer;
export const { addAuth, removeAuth, refreshtoken } = authSlice.actions;

export const authSeletor = (state: any) => state.authReducer.data;

const syncLocal = async (data: any) => {
  localStorage.setItem(localDataNames.authData, JSON.stringify(data));
};
