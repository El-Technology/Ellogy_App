import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Route, Routes } from "react-router-dom";
import "./App.scss";
import { ROUTES } from "./core/constants/routes";
import { Home } from "./pages/Home";

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
    <Routes>
      <Route path={ROUTES.HOME} element={<Home />} />
    </Routes>
  );
};

export default App;
