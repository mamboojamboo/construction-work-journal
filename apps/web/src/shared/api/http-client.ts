import axios, { type AxiosError, type AxiosRequestConfig } from "axios";

import { env } from "@/shared/config/env";

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export const customInstance = async <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const { data } = await apiClient.request<T>({
    ...config,
    ...options,
  });

  return data;
};

export type ErrorType<Error> = AxiosError<Error>;
export type BodyType<BodyData> = BodyData;
