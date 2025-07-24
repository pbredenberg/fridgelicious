import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FridgeContentsState {
  items: string[];
}

const initialState: FridgeContentsState = {
  items: [],
};

const fridgeContentsSlice = createSlice({
  name: "fridgeContents",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<string>) => {
      if (!state.items.includes(action.payload)) {
        state.items.push(action.payload);
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item !== action.payload);
    },
    clearAllItems: state => {
      state.items = [];
    },
    setItems: (state, action: PayloadAction<string[]>) => {
      state.items = action.payload;
    },
  },
});

export const { addItem, removeItem, clearAllItems, setItems } =
  fridgeContentsSlice.actions;
export default fridgeContentsSlice.reducer;
