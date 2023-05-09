import { ColorModeScript } from "@chakra-ui/react"
import * as React from "react"
import {
  ChakraProvider
} from "@chakra-ui/react"
import theme from "@chakra-ui/theme"
import { Hometheme } from "./theme/HomeTheme"
import { createTheme, ThemeProvider } from "@mui/material"
import { AuthProvider } from "./context/AuthProvider"
import RequireAuth from "./components/RequireAuth/RequireAuth"
import * as ReactDOM from "react-dom/client"
import { App } from "./App"
import reportWebVitals from "./reportWebVitals"
import * as serviceWorker from "./serviceWorker"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import CookiesProvider from "react-cookie/cjs/CookiesProvider"


const container = document.getElementById("root")
if (!container) throw new Error('Failed to find the root element');
const root = ReactDOM.createRoot(container)

root.render(
  <React.StrictMode>
    <ColorModeScript />
    <BrowserRouter>
      <ChakraProvider >
        <ThemeProvider theme={createTheme()}>
          <AuthProvider>
            <CookiesProvider>
              <Routes>
                <Route path="/*" element={<App />} />
              </Routes>
            </CookiesProvider>
          </AuthProvider>
        </ThemeProvider>
      </ChakraProvider >
    </BrowserRouter>
  </React.StrictMode>,
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

