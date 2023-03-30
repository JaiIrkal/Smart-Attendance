import {
  ChakraProvider
} from "@chakra-ui/react"

import { Home } from "./components/home"
import { Hometheme } from "./theme/HomeTheme"

export const App = () => (
  <ChakraProvider theme={Hometheme}>
    <Home />
  </ChakraProvider >
)
