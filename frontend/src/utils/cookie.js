// Remove a cookie by name
export const removeCookie = (name) => {
  document.cookie = `${name}=; Max-Age=0; path=/;`;
};
