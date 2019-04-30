import { createStore, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

export type State = {
  app: {
    counter: number;
  };
};

const defaultinitialState = {
  counter: 1
};

export const reducer = (
  state = defaultinitialState,
  action: { type: string }
) => {
  switch (action.type) {
    default:
      return state;
  }
};

const rootReducer = combineReducers({ app: reducer });

export const initStore = (initialState = { app: defaultinitialState }) => {
  return createStore(rootReducer, initialState, composeWithDevTools());
};
