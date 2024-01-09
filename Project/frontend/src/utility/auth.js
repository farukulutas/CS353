import axiosInstance from "../service/axiosInterceptor";

export function setAuthToken(token) {
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
