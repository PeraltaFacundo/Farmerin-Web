import { configureStore } from "@reduxjs/toolkit";
import valorReducer from "./valorSlice";

const store = configureStore({
  reducer: {
    valor: valorReducer,
    // Otros reducers si los tienes
  },
});

export default store;