import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  createMigrate,
  PersistedState,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";

import fridgeContentsReducer from "./fridgeContentsSlice";
import userDataReducer from "./userDataSlice";
import wasteTrackerReducer from "./wasteTrackerSlice";
import themeReducer from "./themeSlice";

const migrations = {
  0: (state: PersistedState): PersistedState => {
    // Handle the case where state might be undefined
    if (!state) {
      return state;
    }

    // Use type assertion to work with the state
    const stateWithFridge = state as typeof state & {
      fridgeContents?: {
        items?: unknown[];
      };
    };

    // Check if we have old string-based items
    const fridgeContents = stateWithFridge.fridgeContents;
    if (
      fridgeContents &&
      Array.isArray(fridgeContents.items) &&
      fridgeContents.items.length > 0 &&
      typeof fridgeContents.items[0] === "string"
    ) {
      // Clear old format items
      return {
        ...state,
        fridgeContents: {
          ...fridgeContents,
          items: [],
        },
      } as PersistedState;
    }

    return state;
  },
};

const persistConfig = {
  key: "root",
  version: 0,
  storage,
  whitelist: ["fridgeContents", "userData", "wasteTracker", "theme"],
  migrate: createMigrate(migrations, { debug: false }),
};

const rootReducer = combineReducers({
  fridgeContents: fridgeContentsReducer,
  userData: userDataReducer,
  wasteTracker: wasteTrackerReducer,
  theme: themeReducer,
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
