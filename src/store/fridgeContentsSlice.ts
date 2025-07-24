import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FoodItem {
  id: string;
  name: string;
  expirationDate: string; // ISO date string (e.g., "2023-12-31")
}

interface FridgeContentsState {
  items: FoodItem[];
}

const initialState: FridgeContentsState = {
  items: [],
};

const fridgeContentsSlice = createSlice({
  name: "fridgeContents",
  initialState,
  reducers: {
    addItem: (
      state,
      action: PayloadAction<{ name: string; expirationDate: string }>
    ) => {
      const { name, expirationDate } = action.payload;
      const itemExists = state.items.find(
        item => item.name.toLowerCase() === name.toLowerCase()
      );

      if (!itemExists) {
        const newItem: FoodItem = {
          id: new Date().getTime().toString(), // Simple unique ID
          name,
          expirationDate,
        };
        state.items.push(newItem);
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearAllItems: state => {
      state.items = [];
    },
    setItems: (state, action: PayloadAction<FoodItem[]>) => {
      state.items = action.payload;
    },
  },
});

export const { addItem, removeItem, clearAllItems, setItems } =
  fridgeContentsSlice.actions;
export default fridgeContentsSlice.reducer;
