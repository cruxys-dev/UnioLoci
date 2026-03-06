import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// API Response Types
export type ApiSuccessResponse<T = unknown, D = unknown> = {
  success: true;
  entries: T;
  meta?: D;
};

export type ApiErrorResponse = {
  success: false;
  message?: string;
  error: string;
  statusCode: number;
};

export type ApiResponse<T = unknown, D = unknown> =
  | ApiSuccessResponse<T, D>
  | ApiErrorResponse;

class BackendClient {
  private tokenGetter: () => string | null = () => localStorage.getItem("jwt");
  private onUnauthorized: () => void = () => {};

  private instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  constructor() {
    // Add request interceptor for auth tokens if needed
    this.instance.interceptors.request.use(
      (config) => {
        // Add auth token here if available
        const token = this.tokenGetter();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Add response interceptor for error handling
    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.onUnauthorized();
          console.error("Unauthorized access");
        }

        if (
          error.response?.data &&
          typeof error.response.data.success === "boolean"
        ) {
          return error.response;
        }

        return Promise.reject(error);
      },
    );
  }

  public setAuthHandlers(handlers: {
    tokenGetter: () => string | null;
    onUnauthorized: () => void;
  }) {
    this.tokenGetter = handlers.tokenGetter;
    this.onUnauthorized = handlers.onUnauthorized;
  }

  async get<T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.get<ApiResponse<T>>(url, config);
  }

  async post<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.post<ApiResponse<T>>(url, data, config);
  }

  async put<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.put<ApiResponse<T>>(url, data, config);
  }

  async patch<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.patch<ApiResponse<T>>(url, data, config);
  }

  async delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.delete<ApiResponse<T>>(url, config);
  }

  // Helper method to get data directly
  async getData<T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.get<T>(url, config);
    return response.data;
  }

  async postData<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.post<T, D>(url, data, config);
    return response.data;
  }

  async putData<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.put<T, D>(url, data, config);
    return response.data;
  }

  async patchData<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.patch<T, D>(url, data, config);
    return response.data;
  }

  async deleteData<T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.delete<T>(url, config);
    return response.data;
  }
}

export const backend = new BackendClient();
export default backend;
