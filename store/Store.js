import { createStore, applyMiddleware, configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import reducer from "../components/Reducer";

const store = configureStore({
    reducer,
});

export default store;