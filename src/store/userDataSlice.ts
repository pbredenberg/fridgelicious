import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserDataState {
  username: string;
  dailyCalorieIntake: number;
}

const initialState: UserDataState = {
  username: "",
  dailyCalorieIntake: 2000,
};

const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setDailyCalorieIntake: (state, action: PayloadAction<number>) => {
      state.dailyCalorieIntake = action.payload;
    },
    updateUserData: (state, action: PayloadAction<Partial<UserDataState>>) => {
      return { ...state, ...action.payload };
    },
    resetUserData: state => {
      state.username = "";
      state.dailyCalorieIntake = 2000;
    },
  },
});

export const {
  setUsername,
  setDailyCalorieIntake,
  updateUserData,
  resetUserData,
} = userDataSlice.actions;
export default userDataSlice.reducer;
