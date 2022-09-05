import { PaginatedResponse } from "./../models/pagination";
import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { IBasket } from "../models/basket";
import { store } from "../store/configureStore";

const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.withCredentials = true;

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

axios.interceptors.request.use((config) => {
  const token = store.getState().account.user?.token;
  if (token) config.headers!.Authorization = `Bearer ${token}`;
  return config;
});

axios.interceptors.response.use(
  async (response) => {
    if (process.env.NODE_ENV === "development") await sleep();
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
      case 403:
        toast.error("You are not allowed to do that!");
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
  postForm: (url: string, data: FormData) =>
    axios
      .post(url, data, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then(responseBody),
  putForm: (url: string, data: FormData) =>
    axios
      .put(url, data, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then(responseBody),
};

function createFormData(item: any) {
  let formData = new FormData();
  for (const key in item) {
    formData.append(key, item[key]);
  }
  return formData;
}

const Admin = {
  createProduct: (product: any) =>
    requests.postForm("products", createFormData(product)),
  updateProduct: (product: any) =>
    requests.putForm("products", createFormData(product)),
  deleteProduct: (id: number) => requests.delete(`products/${id}`),
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
  Admin,
};

export default agent;
