import {
  SET_BARKS,
  LIKE_BARK,
  UNLIKE_BARK,
  LOADING_DATA,
  DELETE_BARK,
  POST_BARK,
  SET_BARK,
  SUBMIT_COMMENT,
} from "../types";

const initialState = {
  barks: [],
  bark: {},
  loading: false,
};

export default function (state = initialState, action) {
  let index;
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true,
      };
    case SET_BARKS:
      return {
        ...state,
        barks: action.payload,
        loading: false,
      };
    case SET_BARK:
      return {
        ...state,
        bark: action.payload,
      };
    case LIKE_BARK:
    case UNLIKE_BARK:
      index = state.barks.findIndex(
        (bark) => bark.barkId === action.payload.barkId
      );
      state.barks[index] = action.payload;
      if (state.bark.barkId === action.payload.barkId) {
        state.bark = action.payload;
      }
      return {
        ...state,
      };
    case DELETE_BARK:
      index = state.barks.findIndex((bark) => bark.barkId === action.payload);
      state.barks.splice(index, 1);
      return {
        ...state,
      };
    case POST_BARK:
      return {
        ...state,
        barks: [action.payload, ...state.barks],
      };
    case SUBMIT_COMMENT:
      return {
        ...state,
        bark: {
          ...state.bark,
          comments: [action.payload, ...state.bark.comments],
        },
      };
    default:
      return state;
  }
}
