import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { docReducer } from "./docSlice";

const rootReducer = combineReducers({
  doc: docReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
