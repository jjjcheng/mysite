import axios from "axios";

const { VITE_API_BASE_URL } = import.meta.env;
const baseURL = VITE_API_BASE_URL || "/";

export const httpClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 响应拦截器：可统一处理错误
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 这里保留占位：可接入全局消息提示或错误上报
    return Promise.reject(error);
  }
);

export default httpClient;


