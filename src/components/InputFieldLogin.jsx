import { useState, forwardRef } from "react"

const InputFieldLogin = forwardRef(
  ({
      icon,
      error,
      type = "text",
      className = "",
      onFocus,
      onBlur,
      ...rest
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false)

    const inputType =
      type === "password"
        ? showPassword
          ? "text"
          : "password"
        : type

    return (
      <div className="input-wrapped">
        {/* INPUT */}
        <input
          ref={ref}
          {...rest}
          type={inputType}
          className={`input-field ${error ? "input-error" : ""} ${className}`}
          onFocus={(e) => {
            rest.onFocus?.(e)
          }}
          onBlur={(e) => {
            rest.onBlur?.(e)
          }}
          onChange={(e) => {
            rest.onChange?.(e)
          }}
         
        />

        {/* ÍCONO IZQUIERDO */}
        {icon && (
          <span className="material-symbols-outlined input-icon-left">
            {icon}
          </span>
        )}

        {/* OJO SOLO SI ES PASSWORD */}
        {type === "password" && (
          <span
            className="material-symbols-outlined input-icon-right"
            onClick={() => setShowPassword(prev => !prev)}
          >
            {showPassword ? "visibility_off" : "visibility"}
          </span>
        )}
      </div>
    )
  }
)

export default InputFieldLogin
