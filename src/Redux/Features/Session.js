import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLogged: false,
  user: {}
};

const sessionReducer = createSlice({
  name: "session",
  initialState,
  reducers: {
    startSession: (state, action) => {
      return {
        ...state,
        isLogged: true,
        user: action.payload
      };
    },

    endSession: () => {
      return {
        isLogged: false
      };
    }
  }
});

export const { startSession, endSession } = sessionReducer.actions;
export default sessionReducer.reducer;
