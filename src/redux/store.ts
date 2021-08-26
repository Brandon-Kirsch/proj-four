import { createStore, applyMiddleware } from 'redux'
import rootReducer from '../reducer'
import thunk from "redux-thunk";

let preloadedState;
const persistedDragonsString = localStorage.getItem('dragons')

if (persistedDragonsString) {
  preloadedState = JSON.parse(persistedDragonsString)
}

const store = createStore(rootReducer, preloadedState, applyMiddleware(thunk));

export default store;