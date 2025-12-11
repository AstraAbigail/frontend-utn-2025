// src/RouterApp.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import AboutUs from "../pages/AboutUs"
import AddPedido from "../pages/AddPedido"
import Login from "../pages/Login"
import Register from "../pages/Register"
import ProtectedRoute from "../components/ProtectedRoute"
import Contact from "../pages/Contact"

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
        <Route path="/contacto" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export { RouterApp }
