import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "../../components/Layout"
import InputFieldLogin from "../../components/InputFieldLogin"
import "../../styles/rulesPassword.css"
import { useForm } from "react-hook-form"
import "../../styles/login.css"


const Register = () => {

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm({ mode: "onChange" })
  

  /*Actualiza automáticamente cuando el valor del campo cambia: no necesitas hacer setState para actualizar los valores.*/
  const passwordValue = watch("password", "")

  // reglas dínamicas
  const passwordRules = {
    length: passwordValue.length >= 8,
    uppercase: /[A-Z]/.test(passwordValue),
    lowercase: /[a-z]/.test(passwordValue),
    number: /[0-9]/.test(passwordValue),
    noSpaces: !/\s/.test(passwordValue),
  }
  
  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!result.success) {
        alert(result.error)
        return
      }

      alert(`✅ Usuario creado con éxito: ${result.data._id}`)
      navigate("/login")
    } catch (error) {
      console.log("Error al registrar:", error)
    }

    reset()
  }
 
  
  return (
    <Layout>
      <div className="center-auth">
        <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
          <h3>Crear Cuenta</h3>
          <div className="field-group">
            <InputFieldLogin
              type="text"
              placeholder="Username"
              icon="person"
              error={ errors.username}
              {...register("username", {
                required: "Campo obligatorio",
                minLength: {
                  value: 4,
                  message: "Mínimo 4 caracteres"
                },
                pattern:{
                  value:/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9]+$/,
                  message:"Debe tener mínimo una letra y un número"
                }
              })}          
            />
            {errors.username && (<p className="error-msg">{errors.username.message}</p>)}
          </div>
          
          <div className="field-group">
            <InputFieldLogin
                type="email"
                placeholder="Email"
                icon="mail"
                error={ errors.email}
                {...register("email", {
                  required: "Campo obligatorio",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Ingrese un email válido"
                  }
                })}          
              />
            {errors.email && (<p className="error-msg ">{errors.email.message}</p>)}
          </div>
      
            <div className="field-group">      
              <InputFieldLogin
                type="password"
                placeholder="Password"
                icon="lock"
                error={ errors.password}
                {...register("password", {
                  required: "Campo obligatorio",
                  minLength: {
                    value: 8,
                    message: "Mínimo 8 caracteres"
                  },
                  validate: {
                    hasNumber: (v) =>
                      /[0-9]/.test(v) || "Debe contener un número",
                    hasUpper: (v) =>
                      /[A-Z]/.test(v) || "Debe contener mayúscula",
                    hasLower: (v) =>
                      /[a-z]/.test(v) || "Debe contener minúscula",
                    noSpaces: (v) =>
                      !/\s/.test(v) || "No puede tener espacios"
                  }
                })}
              />          
          </div>
          {/* LISTA DE VALIDACIONES */}
          { <ul className="password-rules">
              <Rule ok={passwordRules.length} text="Mínimo 8 caracteres" />
              <Rule ok={passwordRules.uppercase} text="Una letra mayúscula" />
              <Rule ok={passwordRules.lowercase} text="Una letra minúscula" />
              <Rule ok={passwordRules.number} text="Un número" />              
              <Rule ok={passwordRules.noSpaces} text="Sin espacios" />
            </ul>
          }

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
