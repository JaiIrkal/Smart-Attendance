import {
  ChakraProvider
} from "@chakra-ui/react"
import { Hometheme } from "./theme/HomeTheme"
import { createTheme, ThemeProvider } from "@mui/material"
import { Home } from './components/Home'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import AdminPage from "./components/Admin/AdminPage/AdminPage"

export const App = () => (
  <BrowserRouter>
    <ChakraProvider theme={Hometheme} >
      <ThemeProvider theme={createTheme()}>
        <main>
          <Routes>
            <Route path='/' element={<Home />}></Route>
            <Route path='admin' element={<AdminPage />}></Route>
          </Routes>
        </main>
      </ThemeProvider>
    </ChakraProvider >
  </BrowserRouter>
)
