import {
  ChakraProvider
} from "@chakra-ui/react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Hometheme } from "./theme/HomeTheme"
import AdminPage from "./components/Admin/AdminPage/AdminPage"
import { createTheme, ThemeProvider } from "@mui/material"
import TeacherView from "./components/Teacher/TeacherPage/TeacherView"
import StudentPage from "./components/Student/StudentPage/StudentPage"
import { ManageTimeTable } from "./components/Admin/AdminPage/TimeTableManagement/ManageTimeTable"
import { AddTeacherForm } from "./components/Admin/AdminPage/TeacherDetails/AddTeacherForm/AddTeacherForm"


export const App = () => (
  <ChakraProvider theme={Hometheme} >
    <ThemeProvider theme={createTheme()}>

      {/* <Home /> */}
      {/* <ViewTimeTable /> */}
      {/* <Tableview /> */}
      <BrowserRouter>
        <Routes>

          <Route path="/admin" element={<AdminPage />}></Route>
          <Route path="/admin/managetimetable" element={<ManageTimeTable />}></Route>
          <Route path="/admin/addteacher" element={<AddTeacherForm />}></Route>
          <Route path="/teacher" element={<TeacherView />}></Route>
          <Route path="/student" element={<StudentPage />}></Route>

          {/* <Route path="/" element={<ViewTimeTable />}></Route> */}
        </Routes>
      </BrowserRouter>

    </ThemeProvider>
  </ChakraProvider >
)
