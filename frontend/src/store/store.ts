import { type ConfigureStoreOptions, configureStore } from "@reduxjs/toolkit";
import { characterApiSlice } from "./api/characterApiSlice";
import { userApiSlice } from "./api/userApiSlice";
import { friendApiSlice } from "./api/friendApiSlice";

const storeProps: ConfigureStoreOptions = {
  reducer: {
    [userApiSlice.reducerPath]: userApiSlice.reducer,
    [characterApiSlice.reducerPath]: characterApiSlice.reducer,
    [friendApiSlice.reducerPath]: friendApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApiSlice.middleware)
      .concat(characterApiSlice.middleware)
      .concat(friendApiSlice.middleware),
};
//biome-ignore lint/suspicious/noExplicitAny: any is used to match the type of preloadedState
export const configureAppStore = (preloadedState?: any) => {
  return configureStore({
    ...storeProps,
    preloadedState,
  });
};

/*
export const resetApiState = (dispatch: AppDispatch) => {
  dispatch(userApiSlice.util.resetApiState());
  dispatch(characterApiSlice.util.resetApiState());
};*/
