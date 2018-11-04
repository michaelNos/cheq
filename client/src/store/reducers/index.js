import { combineReducers } from "redux";
import { reducer as formReduser } from "redux-form";

export default combineReducers({
  form: formReduser,
  vasts: (state, action) => {
    state = {
      vasts: [],
      vast: {}
    };

    switch (action.type) {
      case "GET_VASTS":
        return {
          ...state,
          vasts: action.payload
        };
      case "GET_VAST":
        return {
          ...state,
          vast: action.payload
        };
      case "ADD_VAST":
        return {
          ...state,
          vast: action.payload
        };
      default:
        return state;
    }
  }
});
