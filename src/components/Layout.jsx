
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { FiUser } from "react-icons/fi"
import "../styles/layout.css"
import logo from "../assets/logo-blanco-sadartsa.png";

const Layout = ({ children }) => {
  const { user, logout } = useAuth()
  const navigateUser = useNavigate()

  const handleLogout = () => {
    logout()
    navigateUser("/login")
  }

  return (
    <>
      <header className="layout-header">
        <nav className="layout-nav">

          {/* LOGO IZQUIERDA */}
          <div className="nav-left">
            <Link to="/">
              <img
                src={logo }
                alt="Logo de Sadartsa"
                className="nav-logo"
              />
            </Link>
          </div>

          {/* LINKS DERECHA */}
          <div className="nav-right">
            <Link to="/" className="nav-link">Pedidos</Link>
            <Link to="/nosotros" className="nav-link">Nosotros</Link>
            <Link to="/contacto" className="nav-link">Contactanos</Link>

            {!user ? (
              <Link to="/login" className="nav-icon-link">
                <FiUser className="nav-user-icon" />
              </Link>
            ) : (
              <>
                <Link to="/agregar-pedido" className="nav-link">Agregar pedido</Link>
                <button onClick={handleLogout} className="nav-button-logout">
                  Cerrar sesión
                </button>
              </>
            )}
          </div>

        </nav>
      </header>

      <main className="layout-main">
        {children}
      </main>

      <footer className="layout-footer">
        <p>
          Sitio desarrollado por{" "}
          <a
            href="https://github.com/AstraAbigail"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Abigail Astradas 
          </a>
        </p>
      </footer>
    </>
  )
}

export default Layout
