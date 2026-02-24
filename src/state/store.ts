import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { biomeCatalogueReducer } from "./biomeCatalogueSlice";
import { biomeSourceReducer } from "./biomeSourceSlice";
import { langReducer } from "./langSlice";

const rootReducer = combineReducers({
  biomeSource: biomeSourceReducer,
  biomeCatalogue: biomeCatalogueReducer,
  lang: langReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
