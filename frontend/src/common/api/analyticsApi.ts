import axios from "axios";

const analyticsAPI = axios.create({
  baseURL:import.meta.env.VITE_BASE_URL+ "/analytics",
  withCredentials: true,
});

export const getAnalyticsData = async () => {
  const res = await analyticsAPI.get("/");
  return res.data;
};
