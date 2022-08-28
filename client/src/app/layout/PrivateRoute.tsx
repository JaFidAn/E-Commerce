import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/configureStore";

export default function PrivateRoute() {
  const { user } = useAppSelector((state) => state.account);
  return user ? <Outlet /> : <Navigate to="/login" />;
}
