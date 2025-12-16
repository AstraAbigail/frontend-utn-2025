// src/RouterApp.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import AboutUs from "../pages/AboutUs"
import AddPedido from "../pages/AddPedido"
import Login from "../pages/auth/Login"
import Register from "../pages/auth/Register"
import ProtectedRoute from "../components/ProtectedRoute"
import Contact from "../pages/Contact"
import ForgotPassword from "../pages/auth/ForgotPassword"
import ResetPassword from "../pages/auth/ResetPassword"
import VerifyOTP from "../pages/auth/VerifyOTP"

const RouterApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nosotros" element={<AboutUs />} />
        <Route
          path="/agregar-pedido"
          element={
            <ProtectedRoute>
              <AddPedido />
            </ProtectedRoute>
          }
        />
        {/* <Route path="/contacto" element={<Contact />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />

      </Routes>
    </BrowserRouter>
  )
}

export { RouterApp }
