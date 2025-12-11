import { useNavigate } from "react-router-dom"
import Layout from "../components/Layout"
import { useAuth } from "../context/AuthContext"
import { useState } from "react"
import "../styles/login.css"
import icon from "../assets/lock.png"
import InputFieldLogin from "../components/InputFieldLogin"
import { Link } from "react-router-dom"


const Login = () => {
  const [formData, setFormData] = useState({
    username:"",
    email: "",
    password: ""
  })

  const { login } = useAuth()
  const navigateUser = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })
      const responseData = await response.json()

      if (responseData.error) {
        alert(responseData.error)
        return
      }

      // login exitoso
      login(responseData.token)
      navigateUser("/")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Layout>
      <div className="center-auth">
        <form className="form-container" onSubmit={handleSubmit}>
          <h3>Iniciar Sesión</h3> 

          <InputFieldLogin
            type="text" placeholder="Username"
            icon="person"
            onChange={handleChange} name="username" />
          
          <InputFieldLogin
            type="mail" placeholder="Email" icon="mail"
            onChange={handleChange} name="email" />
          
          <InputFieldLogin
            type="password"
            placeholder="Password"
            name="password"
            icon="lock"
            passwordIcon={icon}     
            onChange={handleChange}
          />
          
          <a className="login-enlaces" href="#">¿Olvidaste la contraseña?</a>
          <button type="submit">Ingresar</button>          
                     
          <p>
            <Link className="login-enlaces-register" to="/registro">
              Crear usuario
            </Link>
          </p>

        </form>        
      </div>
    </Layout>
  )
}

export default Login
