export const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjustedExpirationTime = new Date(expirationTime).getTime();
  const remainingDuration = adjustedExpirationTime - currentTime;
  return remainingDuration;
};

export const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem('token');
  const storedExpirationTime = localStorage.getItem('expirationTime');

  const remainingDuration = calculateRemainingTime(storedExpirationTime);
  // 1 min = 60000 ms
  if (remainingDuration > 60000) {
    return {
      token: storedToken,
      duration: remainingDuration,
    };
  } else {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    return null;
  }
};
