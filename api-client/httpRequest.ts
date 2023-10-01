import { AxiosInstance } from 'axios';
import { IConfig, axiosInstance } from './initRequest';

class HttpRequest {
  api: AxiosInstance;

  constructor() {
    this.api = axiosInstance;
  }

  async get<T = any>(url: string, config?: IConfig) {
    return this.api.get<T, T>(url, config);
  }

  async post<T = any, D = any>(url: string, data: D, config?: IConfig) {
    return this.api.post<T, T, D>(url, data, config);
  }

  async put<T = any, D = any>(url: string, data: D, config?: IConfig) {
    return this.api.put<T, T, D>(url, data, config);
  }

  async patch<T = any, D = any>(url: string, data?: D, config?: IConfig) {
    return this.api.patch<T, T, D>(url, data, config);
  }

  async delete<T = unknown>(url: string, config?: IConfig) {
    return this.api.delete<T, T>(url, config);
  }
}

const httpRequest = new HttpRequest();

export default httpRequest;
