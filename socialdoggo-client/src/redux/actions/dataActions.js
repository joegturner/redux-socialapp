import {
  SET_BARKS,
  LOADING_DATA,
  LIKE_BARK,
  UNLIKE_BARK,
  DELETE_BARK,
  SET_ERRORS,
  POST_BARK,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_BARK,
  STOP_LOADING_UI,
  SUBMIT_COMMENT,
} from "../types";
import axios from "axios";

// Get all barks
export const getBarks = () => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
    .get("/barks")
    .then((res) => {
      dispatch({ type: SET_BARKS, payload: res.data });
    })
    .catch((err) => {
      dispatch({ type: SET_BARKS, payload: [] });
    });
};

export const getBark = (barkId) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/bark/${barkId}`)
    .then((res) => {
      dispatch({ type: SET_BARK, payload: res.data });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((err) => console.log(err));
};

// Post a bark
export const postBark = (newBark) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/bark", newBark)
    .then((res) => {
      dispatch({ type: POST_BARK, payload: res.data.resBark });
      dispatch(clearErrors());
    })
    .catch((err) => {
      dispatch({ type: SET_ERRORS, payload: err.response.data });
    });
};

// Like a bark
export const likeBark = (barkId) => (dispatch) => {
  axios
    .get(`/bark/${barkId}/like`)
    .then((res) => {
      dispatch({ type: LIKE_BARK, payload: res.data });
    })
    .catch((err) => {
      console.log(err);
    });
};

// Unlike a bark
export const unlikeBark = (barkId) => (dispatch) => {
  axios
    .get(`/bark/${barkId}/unlike`)
    .then((res) => {
      dispatch({ type: UNLIKE_BARK, payload: res.data });
    })
    .catch((err) => {
      console.log(err);
    });
};

// submit a comment
export const submitComment = (barkId, commentData) => (dispatch) => {
  axios
    .post(`/bark/${barkId}/comment`, commentData)
    .then((res) => {
      dispatch({ type: SUBMIT_COMMENT, payload: res.data });
      dispatch(clearErrors());
    })
    .catch((err) => {
      dispatch({ type: SET_ERRORS, payload: err.response.data });
    });
};

// Delete a bark
export const deleteBark = (barkId) => (dispatch) => {
  axios
    .delete(`/bark/${barkId}`)
    .then(() => {
      dispatch({ type: DELETE_BARK, payload: barkId });
    })
    .catch((err) => console.log(err));
};

// Get User data for user page
export const getUserData = (userHandle) => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
    .get(`/user/${userHandle}`)
    .then((res) => {
      dispatch({ type: SET_BARKS, payload: res.data.barks });
    })
    .catch(() => {
      dispatch({ type: SET_BARKS, payload: null });
    });
};

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
