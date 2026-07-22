import axios from "axios";
import { auth } from "./firebase";

const api = axios.create({
  baseURL: "https://tool-bp-api.onrender.com/api/v1",
});

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;

  if (user) {
    // Firebase sẽ tự refresh nếu token đã hết hạn
    const token = await user.getIdToken();

    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
