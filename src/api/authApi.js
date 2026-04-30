import api from "../lib/axios.js";

/**
 * Register a new user.
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{user: object, accessToken: string}>}
 */
export async function registerApi(name, email, password) {
  const { data } = await api.post("/auth/register", { name, email, password });
  return data.data;
}

/**
 * Login with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{user: object, accessToken: string}>}
 */
export async function loginApi(email, password) {
  const { data } = await api.post("/auth/login", { email, password });
  return data.data;
}

/**
 * Refresh the access token using httpOnly cookie.
 * @returns {Promise<{accessToken: string}>}
 */
export async function refreshTokenApi() {
  const { data } = await api.post("/auth/refresh");
  return data.data;
}

/**
 * Logout the current user.
 * @returns {Promise<void>}
 */
export async function logoutApi() {
  await api.post("/auth/logout");
}

/**
 * Get the current user's profile.
 * @returns {Promise<{user: object}>}
 */
export async function getMeApi() {
  const { data } = await api.get("/auth/me");
  return data.data;
}
