import { useForm } from "react-hook-form"
import { useNavigate, useSearchParams } from "react-router-dom"
import Layout from "../../components/Layout"
import InputFieldLogin from "../../components/InputFieldLogin"
import "../../styles/rulesPassword.css"

const ResetPassword = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const email = searchParams.get("email")
  const otp = searchParams.get("otp")

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm()

  const passwordValue = watch("password", "")

  // 🔐 reglas SOLO para el primer input
  const passwordRules = {
    length: passwordValue.length >= 8,
    uppercase: /[A-Z]/.test(passwordValue),
    lowercase: /[a-z]/.test(passwordValue),
    number: /[0-9]/.test(passwordValue),
    noSpaces: !/\s/.test(passwordValue),
  }

  const onSubmit = async (data) => {
    const response = await fetch("http://localhost:3000/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        otp,
        password: data.password
      })
    })

    const result = await response.json()

    if (!result.success) {
      alert(result.error || "Error al cambiar contraseña")
      return
    }

    alert("Contraseña actualizada correctamente")
    navigate("/login")
  }

  if (!email || !otp) {
    return (
      <Layout>
        <p className="error-msg">Link inválido o vencido</p>
      </Layout>
    )
  }

  return (
    <Layout>
      <form onSubmit={handleSubmit(onSubmit)} className="form-container">
        <h3>Restablecer contraseña</h3>

        {/* NUEVA CONTRASEÑA */}
        <div className="field-group">
          <InputFieldLogin
            type="password"
            placeholder="Nueva contraseña"
            {...register("password", {
              required: "Contraseña requerida",
              minLength: {
                value: 8,
                message: "Mínimo 8 caracteres"
              },
              validate: {
                hasNumber: v =>
                  /[0-9]/.test(v) || "Debe contener un número",
                hasUpper: v =>
                  /[A-Z]/.test(v) || "Debe contener mayúscula",
                hasLower: v =>
                  /[a-z]/.test(v) || "Debe contener minúscula",
                noSpaces: v =>
                  !/\s/.test(v) || "No puede tener espacios"
              }
            })}
          />
          {errors.password && (
            <p className="error-msg">{errors.password.message}</p>
          )}
        </div>

        

        {/* CONFIRMAR CONTRASEÑA */}
        <div className="field-group">
          <InputFieldLogin
            type="password"
            placeholder="Repetir contraseña"
            {...register("confirmPassword", {
              required: "Confirmá la contraseña",
              validate: value =>
                value === passwordValue || "Las contraseñas no coinciden"
            })}
          />
          {errors.confirmPassword && (
            <p className="error-msg">{errors.confirmPassword.message}</p>
          )}
        </div>
        {/* REGLAS VISUALES */}
        <ul className="password-rules">
          <Rule ok={passwordRules.length} text="Mínimo 8 caracteres" />
          <Rule ok={passwordRules.uppercase} text="Una letra mayúscula" />
          <Rule ok={passwordRules.lowercase} text="Una letra minúscula" />
          <Rule ok={passwordRules.number} text="Un número" />
          <Rule ok={passwordRules.noSpaces} text="Sin espacios" />
        </ul>

        <button type="submit">Cambiar contraseña</button>
      </form>
    </Layout>
  )
}

const Rule = ({ ok, text }) => (
  <li className={ok ? "rule ok" : "rule"}>
    <span className="rule-icon">{ok ? "✔" : "○"}</span>
    {text}
  </li>
)

export default ResetPassword
