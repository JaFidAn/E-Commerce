import { IBasket } from "./basket";

export interface User {
  email: string;
  token: string;
  basket?: IBasket;
  roles?: string[];
}
