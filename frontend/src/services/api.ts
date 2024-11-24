// src/services/Api.ts
import axios, { AxiosInstance, AxiosResponse } from "axios";
// @ts-ignore
import cookie from "cookie";

export default class Api {
  public static BASE_URL = "http://localhost:8081";

  private client: AxiosInstance;

  constructor(userId?: string) {
    this.client = axios.create();
    this.client.defaults.baseURL = "http://localhost:8081";
    this.client.defaults.headers.common["Content-Type"] = "application/json";
    if (userId) {
      this.client.defaults.headers.common["UserId"] = userId;
    }
    this.client.defaults.withCredentials = true;
  }

  // @ts-ignore
  private getSession() {
    const cookies = cookie.parse(document.cookie);
    return cookies["session"];
  }

  get<T = any>(url: string, config?: any): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  post(url: string, data?: any, config?: any): Promise<AxiosResponse<any>> {
    return this.client.post(url, data, config);
  }

  put(url: string, data?: any, config?: any): Promise<AxiosResponse<any>> {
    return this.client.put(url, data, config);
  }

  delete(url: string, config?: any): Promise<AxiosResponse<any>> {
    return this.client.delete(url, config);
  }
}
