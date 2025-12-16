import { useForm } from "react-hook-form"
import Layout from "../../components/Layout"
import InputFieldLogin from "../../components/InputFieldLogin"
import { useNavigate } from "react-router-dom"


const ForgotPassword = () => {

  const navigate=useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()


  // const onSubmit = async (data) => {
  //   await fetch("http://localhost:3000/auth/forgot-password", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(data)
  //   })
  //   navigate(`/verify-otp?email=${data.email}`)

  // }
  const onSubmit = async (data) => {
    await fetch("https://backend-utn-2025.onrender.com/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
    })

    navigate(`/verify-otp?email=${data.email}`)
  }


  return (
    <Layout>
      <form onSubmit={handleSubmit(onSubmit)} className="form-container">
      <h3>Olvidaste tu contraseña</h3>

      <div className="field-group">  
        <InputFieldLogin
          type="email"
          placeholder="Email"
          {...register("email",
              { required: "Email requerido" })}
        />        
        {errors.email && <p className="error-msg">{errors.email.message}</p>}
      </div>

      <button type="submit">Enviar código</button>
      </form>
    </Layout>
  )
}


export default ForgotPassword