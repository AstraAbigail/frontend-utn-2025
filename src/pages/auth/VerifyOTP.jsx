import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import Layout from "../../components/Layout"
import OtpInput from "../../components/InputOTP"

const VerifyOTP = () => {
  
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const email = searchParams.get("email")

  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  

  const handleVerify = async (e) => {
    e.preventDefault()
    setError("")

    if (otp.length !== 6) {
      return setError("El código debe tener 6 dígitos")      
    }     

    // OTP OK → ir a reset password para validar 
    navigate(`/reset-password?email=${email}&otp=${otp}`)
  }

  return (
    <Layout>
      <div className="center-auth">
        <form className="form-container" onSubmit={handleVerify}>
          <h3>Verificar código</h3>

          <p>Ingresá el código de 6 dígitos enviado a tu email: <strong>{email}</strong></p>

          <OtpInput
            length={6}
            value={otp}
            onChange={setOtp} />
          {error && <p className="error-msg">{error}</p>}

          <button type="submit">Verificar        
          </button>
        </form>
      </div>
    </Layout>
  )
}

export default VerifyOTP
