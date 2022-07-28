import { Outlet } from "react-router-dom";
import { Header } from "../../components/Header";
import { Router } from "../../Router";
import { LayoutContainer } from "./styles";

export const DefaultLayout = () => {
  return (
    <LayoutContainer>
      <Header />

      {/* espaço onde o conteúdo vai ser inserido */}
      <Outlet />
    </LayoutContainer>
  );
};
