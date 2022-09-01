import { PaginatedResponse } from "./../models/pagination";
import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { IBasket } from "../models/basket";
import { store } from "../store/configureStore";

const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));

axios.defaults.baseURL = "http://localhost:5000/api/";
axios.defaults.withCredentials = true;

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

axios.interceptors.request.use((config) => {
  const token = store.getState().account.user?.token;
  if (token) config.headers!.Authorization = `Bearer ${token}`;
  return config;
});

axios.interceptors.response.use(
  async (response) => {
    await sleep();
    const pagination = response.headers["pagination"];
    if (pagination) {
      response.data = new PaginatedResponse(
        response.data,
        JSON.parse(pagination)
      );
      return response;
    }
    return response;
  },
  (error: AxiosError) => {
    const { data, status } = error.response as any;
    switch (status) {
      case 400:
        if (data.errors) {
          const modelStateErrors: string[] = [];
          for (const key in data.errors) {
            if (data.errors[key]) {
              modelStateErrors.push(data.errors[key]);
            }
          }
          throw modelStateErrors.flat();
        }
        toast.error(data.title);
        break;
      case 401:
        toast.error(data.title);
        break;
      case 500:
        toast.error(data.title);
        break;

      default:
        break;
    }
    return Promise.reject(error.response);
  }
);

const requests = {
  get: <T>(url: string, params?: URLSearchParams) =>
    axios.get<T>(url, { params }).then(responseBody),
  post: <T>(url: string, body: {}) =>
    axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  delete: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const Catalog = {
  list: (params: URLSearchParams) => requests.get<any>("products", params),
  details: (id: number) => requests.get<any>(`products/${id}`),
  fetchFilters: () => requests.get<any>("/products/filters"),
};

const TestErrors = {
  get400Error: () => requests.get("buggy/bad-request"),
  get401Error: () => requests.get("buggy/unathorized"),
  get404Error: () => requests.get("buggy/not-found"),
  get500Error: () => requests.get("buggy/server-error"),
  getValidationError: () => requests.get("buggy/validation-error"),
};

const Basket = {
  get: () => requests.get<IBasket>("basket"),
  addItem: (productId: number, quantity = 1) =>
    requests.post<any>(
      `basket?productId=${productId}&quantity=${quantity}`,
      {}
    ),
  removeItem: (productId: number, quantity = 1) =>
    requests.delete<IBasket>(
      `basket?productId=${productId}&quantity=${quantity}`
    ),
};

const Account = {
  login: (values: any) => requests.post<any>("account/login", values),
  register: (values: any) => requests.post<any>("account/register", values),
  currentUser: () => requests.get<any>("account/currentUser"),
  fetchAddress: () => requests.get<any>("account/savedAddress"),
};

const Orders = {
  list: () => requests.get<any>("orders"),
  fetch: (id: number) => requests.get<any>(`orders/${id}`),
  create: (values: any) => requests.post<any>("orders", values),
};

const Payments = {
  createPaymentIntent: () => requests.post<any>("payments", {}),
};

const agent = {
  Catalog,
  TestErrors,
  Basket,
  Account,
  Orders,
  Payments,
};

export default agent;
