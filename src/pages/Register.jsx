import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "../components/Layout"
import InputFieldLogin from "../components/InputFieldLogin"
import "../styles/rulesPassword.css"


const Register = () => {
  const [formData, setFormData] = useState({
    username:"",
    email: "",
    password: ""
  })

  //para las reglas
  const [passwordRules, setPasswordRules] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    noSpaces: false
  })
  const [showPasswordRules, setShowPasswordRules] = useState(false)
  

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Si es la contraseña → actualizar reglas dinámicas
    if (e.target.name === "password") {
      setPasswordRules(validatePasswordRules(e.target.value))
    }
   
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })
      
      const responseData = await response.json()

      if (!responseData.success) {
        alert(responseData.error)
      }
      
      alert(`✅ Usuario creado con éxito: ${responseData.data._id}`)
      navigate("/login")
    } catch (error) {
      console.log("Error al registrar el usuario", error)
    }
  }
  // Reglas password
  const validatePasswordRules = (password) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
      noSpaces: !/\s/.test(password)
    }
  }
  


  return (
    <Layout>
      <div className="center-auth">
        <form className="form-container" onSubmit={handleSubmit}>
          <h3>Crear Cuenta</h3>

          <InputFieldLogin
            type="text"
            placeholder="Username"
            icon="person"
            name="username"
            onChange={handleChange}            
          />
          <InputFieldLogin
            type="email"
            placeholder="Email"
            icon="mail"
            name="email"
            onChange={handleChange}            
          />
          <InputFieldLogin
            type="password"
            placeholder="Password"
            icon="lock"
            name="password"
            onChange={handleChange} 
            onFocus={() => setShowPasswordRules(true)}
            onBlur={() => setShowPasswordRules(false)}
          />

          {/* LISTA DE VALIDACIONES */}
          {showPasswordRules && (
            <ul className="password-rules">
              <Rule ok={passwordRules.length} text="Mínimo 8 caracteres" />
              <Rule ok={passwordRules.uppercase} text="Una letra mayúscula" />
              <Rule ok={passwordRules.lowercase} text="Una letra minúscula" />
              <Rule ok={passwordRules.number} text="Un número" />              
              <Rule ok={passwordRules.noSpaces} text="Sin espacios" />
            </ul>
          )}

          <button type="submit">Registrarse</button>
        </form>
      </div>
    </Layout>
  )
}

  const Rule = ({ ok, text }) => (
    <li className={ok ? "rule ok" : "rule"}>
      <span className="rule-icon">{ok ? "✔" : "○"}</span>
      {text}
    </li>
  )

export default Register
