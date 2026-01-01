import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import MainApp from '../components/MainApp'

const AppRoutes = () => {
  return (
   <Router>
    <Routes>
        <Route path='/' element={<MainApp/>}/>
    </Routes>
   </Router>
  )
}

export default AppRoutes
