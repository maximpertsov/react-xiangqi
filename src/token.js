import jwtDecode from 'jwt-decode';

export const getAccessToken = () => localStorage.getItem('accessToken');

export const setAccessToken = (accessToken) => {
  localStorage.setItem('accessToken', accessToken);
};

export const getUsername = () => {
  const token = getAccessToken();
  if (token === null) return null;

  const { sub } = jwtDecode(token);
  return sub;
};

export default {};
