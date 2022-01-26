import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter} from 'react-router-dom'
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from '@mui/material/CssBaseline';
import Themes from "./themes";

import 'smart-webcomponents-react/source/styles/smart.default.css';
import "./styles/_global.css";

import App from "./components/App";
import * as serviceWorker from "./serviceWorker";
import { LayoutProvider } from "./context/LayoutContext";
import { UserProvider } from "./context/UserContext";


ReactDOM.render(
  <LayoutProvider>
    <BrowserRouter>
      <ThemeProvider theme={Themes.default}>
        <CssBaseline />
        <UserProvider>
          <App />
        </UserProvider>
      </ThemeProvider>
    </BrowserRouter>
  </LayoutProvider>,
  document.getElementById("root"),
);

serviceWorker.unregister();
