import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FoodItem } from "./fridgeContentsSlice";

export interface WastedItem extends FoodItem {
  dateChucked: string; // ISO date string when the item was chucked
}

interface WasteTrackerState {
  wastedItems: WastedItem[];
}

const initialState: WasteTrackerState = {
  wastedItems: [],
};

const wasteTrackerSlice = createSlice({
  name: "wasteTracker",
  initialState,
  reducers: {
    chuckItem: (state, action: PayloadAction<FoodItem>) => {
      const wastedItem: WastedItem = {
        ...action.payload,
        dateChucked: new Date().toISOString(),
      };
      state.wastedItems.push(wastedItem);
    },
    clearWastedItems: state => {
      state.wastedItems = [];
    },
    setWastedItems: (state, action: PayloadAction<WastedItem[]>) => {
      state.wastedItems = action.payload;
    },
  },
});

export const { chuckItem, clearWastedItems, setWastedItems } =
  wasteTrackerSlice.actions;
export default wasteTrackerSlice.reducer;
