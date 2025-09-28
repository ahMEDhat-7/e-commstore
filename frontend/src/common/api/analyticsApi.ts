import axios from "axios";

const analyticsAPI = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:7000/api/analytics"
      : "/api/analytics",
  withCredentials: true,
});

export const getAnalyticsData = async () => {
  const res = await analyticsAPI.get("/");
  return res.data;
};
