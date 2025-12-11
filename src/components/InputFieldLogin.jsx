import { useState } from "react";

const InputFieldLogin = ({ type, placeholder, name, icon, onChange, onFocus, onBlur, className, value })=>{
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <div className={`input-wrapped ${className || ""}`}>

      {/* INPUT */}
      <input
        className="input-field"
        type={type === "password" ? (showPassword ? "text" : "password") : type}
        placeholder={placeholder}
        name={name}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        value = { value }
        required
      />

      {/* ÍCONO IZQUIERDO */}
      {icon && (
        <span className="material-symbols-outlined input-icon-left">
          {icon}
        </span>
      )}

      {/* OJO A LA DERECHA SOLO SI ES PASSWORD */}
      {type === "password" && (
        <span
          className="material-symbols-outlined input-icon-right"
          onClick={togglePassword}
        >
          {showPassword ? "visibility_off" : "visibility"}
        </span>
      )}

    </div>
  )
}

export default InputFieldLogin;
