import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppSelector } from "../store/configureStore";

interface Props {
  roles?: string[];
}

export default function PrivateRoute(props: Props) {
  const { user } = useAppSelector((state) => state.account);

  if (!user) return <Navigate to="/login" />;

  if (props.roles && !props.roles.some((r) => user.roles?.includes(r))) {
    toast.error("Not authorised to access to this area");
    return <Navigate to="/catalog" />;
  }

  return <Outlet />;
}
