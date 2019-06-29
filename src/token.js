export const getAccessToken = () => window
  .sessionStorage.getItem('accessToken');

export const setAccessToken = (accessToken) => {
  window.sessionStorage.setItem('accessToken', accessToken);
};

export default {};
