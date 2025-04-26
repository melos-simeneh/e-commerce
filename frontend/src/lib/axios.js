import axios from "axios";
const isDev = import.meta.env.MODE === "development";
console.log(import.meta.mode);
const axiosInstance = axios.create({
  baseURL: isDev ? "http://localhost:5000/api" : "/api",
  withCredentials: true, // send cookies to the server
});
export default axiosInstance;
