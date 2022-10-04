import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import postReducer from "./postFeedbackSlice";
import {createStore, combineReducers, applyMiddleware} from 'react';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import { productListReducer } from "./reducers/productReducers";
export default configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
  },
});

const reducer = combineReducers({
  productList: productListReducer,
});
const initialState = {}
const middleware = [thunk];
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);
// export default store;
// import { combineReducers, configureStore } from "@reduxjs/toolkit";
// import authReducer from "./authSlice";
// import {
//   persistStore,
//   persistReducer,
//   FLUSH,
//   REHYDRATE,
//   PAUSE,
//   PERSIST,
//   PURGE,
//   REGISTER,
// } from "redux-persist";
// import storage from "redux-persist/lib/storage";
// const persistConfig = {
//   key: "root",
//   version: 1,
//   storage,
// };
// const rootReducer = combineReducers({ auth: authReducer });
// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//       },
//     }),
// });
// export let persistor = persistStore(store);
