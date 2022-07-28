import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import { Router } from "../Router";

export const DefaultLayout = () => {
  return (
    <div>
      <Header />

      {/* espaço onde o conteúdo vai ser inserido */}
      <Outlet />
    </div>
  );
};
