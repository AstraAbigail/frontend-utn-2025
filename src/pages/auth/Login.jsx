import { useNavigate } from "react-router-dom"
import Layout from "../../components/Layout"
import { useAuth } from "../../context/AuthContext"
import "../../styles/login.css"
import icon from "../../assets/lock.png"
import InputFieldLogin from "../../components/InputFieldLogin"
import { Link } from "react-router-dom"
import { useForm} from "react-hook-form"


const Login = () => {

  const { login } = useAuth()
  const navigateUser = useNavigate()

  const {
    register,
    handleSubmit,
    formState:{ errors },
    reset
  }=useForm({mode:"onChange"})

  const onSubmit = async (data) => {
    console.log("DATA QUE LLEGA DEL FORM:", data)
   
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
      const responseData = await response.json()

      if (responseData.error) {
        alert(responseData.error)
        return
      }
      
      login(responseData.token)
      navigateUser("/")
    } catch (error) {
      console.log(error)
    }    
    reset()
  }

  return (
    <Layout>
      <div className="center-auth">
        <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
          <h3>Iniciar Sesión</h3> 
          <div className="field-group">     
            <InputFieldLogin
              type="text"
              placeholder="Username"
              icon="person"                     
              {...register("username", {
                required: "Campo obligatorio",
                minLength:{
                  value:4,
                  message:"Debe tener minimo 4 carácteres"
                },
                pattern:{
                  value:/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9]+$/,
                  message:"Debe tener mínimo una letra y un número"
                }
              }
              )}
            />
            {errors.username && ( <p className="error-msg "> {errors.username.message} </p> )}
          </div> 

          <div className="field-group">     
            <InputFieldLogin
              type="mail"
              placeholder="Email"
              icon="mail"                     
              {...register("email", {   
                required: "Campo obligatorio", 
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Ingrese un email válido"
                }
              }
              )}                
            />
            {errors.email && (<p className="error-msg ">{errors.email.message}</p>)}
          </div>

          <div className="field-group">     
            <InputFieldLogin
              type="password"
              placeholder="Password"          
              icon="lock"                    
              {...register("password", {
                required: "Campo obligatorio",
                pattern:{
                  value:/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9]+$/,
                  message:"Debe tener mínimo una letra y un número"
                }
              })}                  
            />
            {errors.password && (<p className="error-msg ">{errors.password.message}</p>)}
          </div>
          
         <Link to="/forgot-password" className="login-enlaces">
              ¿Olvidaste la contraseña?
        </Link>
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
