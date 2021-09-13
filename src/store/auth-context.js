import React, { useState, useEffect, useCallback } from 'react';
import { calculateRemainingTime, retrieveStoredToken } from '../js/helpers';
let logoutTimer;

const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();
  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  }

  const [token, setToken] = useState(initialToken);
  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');

    // clear timer when user logs out
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const loginHandler = (tokenArg, expirationTime) => {
    setToken(tokenArg);
    localStorage.setItem('token', tokenArg);
    localStorage.setItem('expirationTime', expirationTime);

    const remainingDuration = calculateRemainingTime(expirationTime);
    // const remainingDuration = 10000; // logout in 10s test
    logoutTimer = setTimeout(logoutHandler, remainingDuration);
  };

  useEffect(() => {
    if (tokenData) {
      console.log(tokenData.duration);
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
