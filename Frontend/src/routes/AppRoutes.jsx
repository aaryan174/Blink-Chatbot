import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Register from '../components/Auth/Register'
import Login from '../components/Auth/Login'
import MainApp from '../components/MainApp'

const AppRoutes = () => {
  return (
   <Router>
    <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/home' element={<MainApp/>}/>
    </Routes>
   </Router>
  )
}

export default AppRoutes
