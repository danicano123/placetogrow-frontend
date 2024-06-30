import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    data: {},
    token: "",
  },
  reducers: {
    fetchAuth: (state, action) => {
      return action.payload;
    },
  },
});

export default authSlice.reducer;
export const { fetchAuth } = authSlice.actions;
