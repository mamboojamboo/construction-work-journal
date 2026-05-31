import axios, { type AxiosRequestConfig } from "axios";

import { env } from "@/shared/config/env";

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export const customInstance = async <T>(
  config: AxiosRequestConfig,
): Promise<T> => {
  const { data } = await apiClient.request<T>(config);

  return data;
};
