import { useEffect, useState } from 'react';
import './App.css';
import Dashboard from './seperate/Dashboard';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './seperate/Login';
import Forgotpassword from './seperate/Forgotpassword';
import Resetpassword from './seperate/Resetpassword';
import Register from './seperate/Register';
import ProtectedRoute from './Auth/ProtectRoute';
import NotFound from './seperate/NotFound';
import { Navigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from "react-toastify";
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);


  return (
    <div className="App">

      <BrowserRouter>
        {/* <ToastContainer /> */}
        <Routes>
          {/* Redirect from "/" to "/dashboard/analytics" */}
          <Route exact path="/" element={<Login />} />
          <Route exact path="/forgot-password" element={<Forgotpassword />} />
          <Route exact path="/resetpassword/:token" element={<Resetpassword />} />
          <Route exact path="/register" element={<Register />} />
          <Route path="/dashboard/user-list" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/admin-setting" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/flashloan-history" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>

      </BrowserRouter>
    </div>
  );
}

export default App;