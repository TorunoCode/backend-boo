import { createSlice } from "@reduxjs/toolkit";

export const postFeedbackSlice = createSlice({
  name: "postFeedback",
  initialState: {
    postFeedbacks: [
      // {
      //   nameuser: "",
      //   urlAvatar: "",
      //   content_feedback: "",
      // },
    ],
  },
  reducers: {
    createPost: (state, action) => {
      state.postFeedbacks = [...state.postFeedbacks, action.payload];
    },
  },
});
export const { createPost } = postFeedbackSlice.actions;
export default postFeedbackSlice.reducer;
