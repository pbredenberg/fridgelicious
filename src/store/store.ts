import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, createMigrate } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";

import fridgeContentsReducer from "./fridgeContentsSlice";
import userDataReducer from "./userDataSlice";
import wasteTrackerReducer from "./wasteTrackerSlice";

const migrations = {
  0: (state: any) => {
    const hasFridgeContents = state.fridgeContents;
    const hasItems = hasFridgeContents && Array.isArray(state.fridgeContents.items);
    const hasOldFormat = hasItems && state.fridgeContents.items.length > 0 && typeof state.fridgeContents.items[0] === "string";
    
    if (hasOldFormat) {
      return {
        ...state,
        fridgeContents: { ...state.fridgeContents, items: [] },
      };
    }
    
    return state;
  },
};

const persistConfig = {
  key: "root",
  version: 0,
  storage,
  whitelist: ["fridgeContents", "userData", "wasteTracker"],
  migrate: createMigrate(migrations, { debug: false }),
};

const rootReducer = combineReducers({
  fridgeContents: fridgeContentsReducer,
  userData: userDataReducer,
  wasteTracker: wasteTrackerReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
