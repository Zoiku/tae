import {
  INPUTING,
  SEND_REQUEST,
  REQUEST_SUCCESSFUL,
  REQUEST_FAILED
} from "./Actions";

export const INITIAL_STATE = {
  requestState: {
    data: {},
    error: null,
    loading: false
  },
  payload: {}
};

export const formReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case INPUTING:
      return {
        ...state,
        payload: {
          ...state.payload,
          [action.prop]: action.value
        }
      };

    case SEND_REQUEST:
      return {
        ...state,
        requestState: {
          ...state.requestState,
          loading: true
        }
      };

    case REQUEST_SUCCESSFUL:
      return {
        ...state,
        requestState: {
          ...state.requestState,
          data: action.payload,
          error: null,
          loading: false
        }
      };

    case REQUEST_FAILED:
      return {
        ...state,
        requestState: {
          ...state.requestState,
          error: action.error,
          loading: false
        }
      };

    default:
      return state;
  }
};
