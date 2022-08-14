export const setUserData = (data) =>
  localStorage.setItem("user", JSON.stringify(data));
export const getUserData = () => JSON.parse(localStorage.getItem("user"));
export const getAuthToken = () => getUserData().authorization;
export const clearUserData = () => localStorage.clear();

export const checkEmail = (email) => /^.+@.+\..{2,3}$/.test(email);
