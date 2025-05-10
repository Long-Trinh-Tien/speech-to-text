export function saveWebAPIToken(token) {
  localStorage.setItem("token", token);
}

export function removeWebAPIToken() {
  localStorage.removeItem("token");
}

export function getCurrentlyTokenLogin() {
  const token = localStorage.getItem("token");
  return token;
}
