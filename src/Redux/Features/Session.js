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

    initUser: (state, action) => {
      return {
        ...state,
        user: {
          ...state.user,
          profile: action.payload
        }
      };
    },

    initCompany: (state, action) => {
      return {
        ...state,
        user: {
          ...state.user,
          profile: {
            ...state.user.profile,
            company: action.payload
          }
        }
      };
    },

    endSession: () => {
      return {
        isLogged: false
      };
    }
  }
});

export const { startSession, endSession, initUser, initCompany } =
  sessionReducer.actions;
export default sessionReducer.reducer;
