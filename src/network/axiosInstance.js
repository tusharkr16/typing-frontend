import axios from "axios";

const url = 'https://monkeytype-uqby.onrender.com';

export const axiosInstance = axios.create({
  baseURL: url,
});

axiosInstance.interceptors.request.use((config) => {
  
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";
  console.log(token, "token from localStorage");

  
  config.headers["x-auth-token"] = token ? token : "";


  return config;
});
