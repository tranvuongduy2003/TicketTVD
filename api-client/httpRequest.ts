import { AxiosInstance } from 'axios';
import { IConfig, axiosInstance } from './initRequest';
import { ApiResponse } from '@/models';

class HttpRequest {
  api: AxiosInstance;

  constructor() {
    this.api = axiosInstance;
  }

  async get<T = any>(url: string, config?: IConfig) {
    return this.api.get<ApiResponse<T>, ApiResponse<T>>(url, config);
  }

  async post<T = any, D = any>(url: string, data: D, config?: IConfig) {
    return this.api.post<ApiResponse<T>, ApiResponse<T>, D>(url, data, config);
  }

  async put<T = any, D = any>(url: string, data: D, config?: IConfig) {
    return this.api.put<ApiResponse<T>, ApiResponse<T>, D>(url, data, config);
  }

  async patch<T = any, D = any>(url: string, data?: D, config?: IConfig) {
    return this.api.patch<ApiResponse<T>, ApiResponse<T>, D>(url, data, config);
  }

  async delete<T = unknown>(url: string, config?: IConfig) {
    return this.api.delete<ApiResponse<T>, ApiResponse<T>>(url, config);
  }
}

const httpRequest = new HttpRequest();

export default httpRequest;
