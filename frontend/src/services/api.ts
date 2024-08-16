import axios, {AxiosInstance} from "axios";
import cookie from "cookie";

export default class Api {
    private client: AxiosInstance;

    constructor(userId?: string) {
        this.client = axios.create();
        this.client.defaults.baseURL = "http://localhost:8000";
        this.client.defaults.headers.common["Content-Type"] = "application/json";
        this.client.defaults.headers.common["UserId"] = userId;
        this.client.defaults.withCredentials = true;
    }

    private getSession() {
        const cookies = cookie.parse(document.cookie);
        return cookies["session"];
    }

    get<T = any>(url: string, config?: any) {
        return this.client.get<T>(url, config);
    }

    post(url: string, data?: any, config?: any) {
        return this.client.post(url, data, config);
    }

    put(url: string, data?: any, config?: any) {
        return this.client.put(url, data, config);
    }

    delete(url: string, config?: any) {
        return this.client.delete(url, config);
    }
}
