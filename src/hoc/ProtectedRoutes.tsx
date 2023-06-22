import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "../core/constants/routes";

export const ProtectedRoutes = () => {
  const token = localStorage.getItem('token');
  const isAuth = !!token;

  return isAuth ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />;
};