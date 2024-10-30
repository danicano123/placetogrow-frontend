// redux/slices/subscriptionSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface SubscriptionState {
  requestId: string | null;
}

const initialState: SubscriptionState = {
  requestId: null,
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    setRequestId: (state, action) => {
      return action.payload;
    },
  },
});

export const { setRequestId } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
