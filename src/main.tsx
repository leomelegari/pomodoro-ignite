import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "styled-components";
import { defaultTheme } from "./styles/themes/default";
import { GlobalStyle } from "./styles/global";
import { BrowserRouter } from "react-router-dom";
import { CyclesContextProvider } from "./contexts/CiclesContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={defaultTheme}>
      <CyclesContextProvider>
        <BrowserRouter>
          <GlobalStyle />
          <App />
        </BrowserRouter>
      </CyclesContextProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
