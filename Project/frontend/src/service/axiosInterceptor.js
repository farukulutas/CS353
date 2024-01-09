import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `http://localhost:8080`,
});

export function setAuthToken(token) {
  console.log("set auth token", token);
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default axiosInstance;
