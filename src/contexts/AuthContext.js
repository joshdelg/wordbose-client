import React, { createContext, useReducer } from "react";

export const AuthContext = createContext();

const authReducer = (state, action) => {
  switch(action.type) {
    case 'LOG_IN':
      return {...state, isAuthenticated: true};
    case 'SIGN_OUT':
      return {...state, isAuthenticated: false};
    default:
      return state;
  }
}

function AuthContextProvider(props) {

  const [authData, dispatch] = useReducer(authReducer, {isAuthenticated: false});

  return (
    <AuthContext.Provider value={{authData, dispatch}}>
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;