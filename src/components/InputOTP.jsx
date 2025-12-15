import { useEffect, useRef } from "react"
import "../styles/inputOTP.css"

const OtpInput = ({ length = 6, value="", onChange }) => {
  //Array de input HTML, para poder mover el cursor.
  const inputs = useRef([])

  //se posiciona
  useEffect(() => {
    inputs.current[0]?.focus()
  }, [])

  const handleChange = (e, index) => {
    const digito = e.target.value
    //validacion de numeros o vacio para borrar
    if (!/^[0-9]?$/.test(digito)) return

    //compara con el nuevo array valores para renderizar con onChange
    const newValue = value.split("")
    newValue[index] = digito
    onChange(newValue.join(""))

    if (digito && index < length - 1) {
      inputs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }
  //por si se quiere copiar y pegar el codigo del email
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").slice(0, length)
    if (!/^[0-9]+$/.test(paste)) return
    
    onChange(paste)
    inputs.current[newValue.length - 1]?.focus()
  }

  return (
    <div className="otp-inputs">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={el => (inputs.current[i] = el)}
          type="text"
          maxLength={1}
          value={value[i] || ""}
          onChange={e => handleChange(e, i)}
          onKeyDown={e => handleKeyDown(e, i)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  )
}

export default OtpInput
