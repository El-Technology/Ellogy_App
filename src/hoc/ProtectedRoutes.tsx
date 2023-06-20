import {Navigate, Outlet} from "react-router-dom";
import {ROUTES} from "../core/constants/routes";

export const ProtectedRoutes = () => {
  const isAuth = false;

  return isAuth ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />
}