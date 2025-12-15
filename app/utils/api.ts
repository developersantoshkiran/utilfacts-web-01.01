"use client";
import axios from "axios";

const loginAndSignUpRoutes = ["/ums/user", "/auth/login"];
const env = process.env.NODE_ENV;
const BASE_URL =
  env === "development"
    ? "/api/v1"
    : "/api/v1";
const axiosOptions:any = {
  baseURL: BASE_URL,
  timeout: 40000,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json; charset=utf-8",
  },
};
const instance = axios.create(axiosOptions);

instance.interceptors.request.use(
  async (config) => {
    let value = localStorage.getItem("token");
    let refreshToken = localStorage.getItem("refresh-token");
    if (loginAndSignUpRoutes.some((route) => config.url?.includes(route))) {
      value = "";
      localStorage.removeItem("token");
    }

    // refresh this value by reading from localStorage or session token or jwt or cookie
    config.headers.set("token", value);
    config.headers.set("refresh-token", refreshToken);
    config.headers.set("service", "electricity");
    config.headers.set("Authorization", `Bearer ${value}`);
    config.headers.set("accept", "*");
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export const GET = <T>(url: string) => {
  return instance
    .get(url)
    .then((res) => {
      return res.data as T;
    })
    .catch((error) => {
      return Promise.reject({
        message: error?.message,
        data: error.response?.data,
      });
    });
};

export function POST<T>(url: string, data: any) {
  return instance
    .post(url, data)
    .then((res) => {
      return res.data as T;
    })
    .catch((error) => {
      return Promise.reject({
        message: error?.message,
        data: error.response?.data,
      });
    });
}

export const UPDATE = <T>(url: string, data: any) => {
  return instance
    .put(url, data)
    .then((res) => {
      return res.data as T;
    })
    .catch((error) => {
      return Promise.reject({
        message: error?.message,
        data: error.response?.data,
      });
    });
};

export const DELETE = <T>(url: string) => {
  return instance
    .delete(url)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return Promise.reject({
        message: error?.message,
        data: error.response?.data,
      });
    });
};

// Response interceptor for API calls
instance.interceptors.response.use(
  (response) => {
    if (
      response.headers &&
      response.headers.get &&
      (response.headers as any).get("token")
    ) {
      localStorage.setItem("token", (response.headers as any).get("token"));
      localStorage.setItem(
        "refresh-token",
        (response.headers as any).get("refresh-token")
      );
    }
    return response;
  },
  async function (error) {
    const { config, response } = error;
    //403 unauthorized
    if (response?.status !== 401 || config._retry) {
      return Promise.reject(error);
    }

  
    return axios
      .post("/auth/refresh-token",{}, {
        baseURL: BASE_URL,
        timeout: 40000,
        headers: {
          "refresh-token": localStorage.getItem("refresh-token"),
        },
      })
      .then((res) => {
        localStorage.setItem("token", (res.headers as any).get("token"));
        config._retry = true;
        // If you are using localStorage, update the token and Authorization header here
        return instance(config);
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }
);

export default instance;
