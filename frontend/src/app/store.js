import { configureStore } from '@reduxjs/toolkit';
import mainReducer from './reducers/mainSlice';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist'
// import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { composeWithDevTools } from 'redux-devtools-extension';
import { applyMiddleware } from 'redux';

// const persistConfig = {
//     key: 'root',
//     storage,
// };

export const reducers = combineReducers({
    mainReducer: mainReducer,
  });

// const persistedReducer = persistReducer(persistConfig, reducers);
  
// 

export default configureStore({
    reducer: mainReducer,
    // composeEnhancers(applyMiddleware(...middlewares))
}
// )

// const store = createStore(reducers);

// const store = createStore(
//     persistedReducer,
//     {},
//     composeWithDevTools(applyMiddleware())
// );

// export default store;
