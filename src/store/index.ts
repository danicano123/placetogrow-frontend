import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // almacenamiento local
import authSlice from "./slices/authSlice";
import subscriptionSlice from "./slices/subscriptionSlice"; 


const authPersistConfig = {
  key: 'auth',
  storage,
};

// Configuración de persistencia para subscription
const subscriptionPersistConfig = {
  key: 'subscription',
  storage,
};

const authPersistedReducer = persistReducer(authPersistConfig, authSlice);
const subscriptionPersistedReducer = persistReducer(subscriptionPersistConfig, subscriptionSlice);


export const store = configureStore({
  reducer: {
    auth: authPersistedReducer,
    subscription: subscriptionPersistedReducer,
  },
});

export const persistor = persistStore(store);
