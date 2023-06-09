import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Route, Routes } from "react-router-dom";
import "./App.scss";
import { ROUTES } from "./core/constants/routes";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login/Login";
import { SignUp } from "./pages/SignUp/SignUp";
import { ProtectedRoutes } from "./hoc/ProtectedRoutes";
import { ResetPassword } from "./pages/ResetPassword/ResetPassword";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const App = () => {
  const { i18n } = useTranslation();
  useEffect(() => {
    if (i18n.language === "ar") {
      document.body.classList.add("rtl");
    } else {
      document.body.classList.remove("rtl");
    }
  }, [i18n.language]);

  return (
    <>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.SIGNUP} element={<SignUp />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
        <Route path={ROUTES.CREATE_NEW_PASSWORD} element={<ResetPassword />} />
        <Route element={<ProtectedRoutes />}>
          <Route path={ROUTES.HOME} element={<Home />} />
        </Route>
      </Routes>

      <ToastContainer
        style={{
          width: "400px",
          maxWidth: "fit-content",
        }}
      />
    </>
  );
};

export default App;
