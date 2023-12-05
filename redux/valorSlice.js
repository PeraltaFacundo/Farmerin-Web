import { createSlice } from "@reduxjs/toolkit";

const valorSlice = createSlice({
  name: "valor",
  initialState: 0,
  reducers: {
    updateValor: (state, action) => {
      return action.payload;
    },
  },
});

export const { updateValor } = valorSlice.actions;

export default valorSlice.reducer;