
import { Routes, Route } from "react-router-dom"
import AdminPage from "./components/Admin/AdminPage/AdminPage"

import { Login } from "./components/Login/Login"
import TeacherPage from './components/Teacher/TeacherPage/TeacherPage'
import StudentPage from './components/Student/StudentPage/StudentPage'
import RequireAuth from './components/RequireAuth/RequireAuth'
import PersistLogin from './components/PersistLogin/PersistLogin'
import Unauthorized from './components/FallBackPages/Unauthorized'
import { Flex } from '@chakra-ui/react'
import Layout from './components/Layout'
import { useEffect } from "react"
import { StudentProvider } from "./context/StudentProvider"




export const App = () => (



  <Flex bg={""} >
    <Routes >
      <Route path='/' element={<Layout />}>
        <Route path='/' element={<Login />} />
        <Route path='/unauthorized' element={<Unauthorized />} />

        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRole="admin" />}>
            <Route path='admin' element={<AdminPage />}></Route>
          </Route>
          <Route element={<RequireAuth allowedRole="student" />}>

            <Route path='student' element={<StudentProvider><StudentPage /></StudentProvider>}></Route>

          </Route>
          <Route element={<RequireAuth allowedRole="teacher" />}>
            <Route path='teacher' element={<TeacherPage />}></Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  </Flex>

)