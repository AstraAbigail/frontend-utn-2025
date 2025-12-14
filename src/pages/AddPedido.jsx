import { useState } from "react"
import Layout from "../components/Layout"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import InputFieldLogin from "../components/InputFieldLogin"
import { ORDEN_ESTADOS } from "../constants/estados"
import { PUERTAS } from "../constants/puertas"
import { useForm } from "react-hook-form"
import "../styles/addPedido.css"

const AddPedido = () => {
  
  const { 
    register,
    handleSubmit,    
    formState: { errors },
  } = useForm(({ mode: "onSubmit" }))

  
  const [productoForm, setProductoForm] = useState({
    cantidad: "",
    category: "",
    line: "",
    model: "",
    marco: "",
    color: "",
    mano: "",
    precio: ""
  })

  const [productos, setProductos] = useState([])
  const { token } = useAuth()
  const navigate = useNavigate()
 
  const handleProductoChange = (e, v) => {
   const { name, value } = e.target


    const parsed = (name === "cantidad" || name === "precio")
    ? Number(v) || ""
    : value

    setProductoForm(prev => ({ ...prev, [name]: parsed }))
  }



  const agregarProducto = () => {

    if (!productoForm.cantidad || productoForm.cantidad <= 0) {
      return alert("Cantidad inválida")
    }
    if (!productoForm.precio || productoForm.precio <= 0) {
      return alert("Precio inválido")
    }

    if (!productoForm.category || !productoForm.line || !productoForm.model) {
      return alert("Faltan datos del producto")
    }

    setProductos(prev => [...prev, productoForm])
    setProductoForm({
    cantidad: "",
    category: "",
    line: "",
    model: "",
    marco: "",
    color: "",
    mano: "",
    precio: ""
    })
    
  }
  
  
  const eliminarProducto = (index) => {
    setProductos(prev => prev.filter((_, i) => i !== index))
  }
  const onSubmit = async (data) => {
    if (productos.length === 0) {
      return alert("Debes agregar al menos un producto")
    }


    const pedidoAEnviar = {
      n_pedido: Number(data.n_pedido),
      cliente: {
        nombre: data.nombre,
        identificacion: data.identificacion,
        domicilio: data.domicilio
      },
      estado: data.estado,
      productos: productos.map(p => ({
      ...p,
      cantidad: Number(p.cantidad),
      precio: Number(p.precio)
      }))
    }


    try {
      const res = await fetch("http://localhost:3000/pedidos", {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(pedidoAEnviar)
      })


      if (!res.ok) throw new Error()


      alert("✅ Pedido guardado correctamente")
      navigate("/")
      } catch (err) {
      alert("❌ Error al guardar el pedido")
      }
    }
   

  function getMarcosDisponibles(category, line) {
    if (!category || !line) return []
    if (category === "Exterior") return []

    const lineaDatos = PUERTAS.Interior.Lineas[line]
    if (lineaDatos.Marcos) return Object.keys(lineaDatos.Marcos)

    let tieneChapa24 = false

    if (lineaDatos.modelos) {
      Object.values(lineaDatos.modelos).forEach(modelo => {
        if (modelo.Marco && modelo.Marco["Chapa 24"]) tieneChapa24 = true
      })
    }

    const marcosBase = ["Chapa 18", "Pino", "Cambara"]
    if (tieneChapa24) marcosBase.unshift("Chapa 24")
    return marcosBase
  }

  const getManos = () => ["Derecha", "Izquierda"]

  function getAvailableColors(category, line) {
    if (!category || !line) return []

    const cat = PUERTAS[category]
    if (!cat) return []

    if (category === "Interior") {
      const lineData = cat.Lineas[line]
      if (!lineData) return []
      if (lineData.Color) return lineData.Color
      return cat.Color || []
    }

    if (category === "Exterior") {
      const lineData = cat.Lineas[line]
      if (!lineData) return []

      if (lineData.general?.color) return lineData.general.color

      if (lineData.modelos) {
        let colors = new Set()
        Object.values(lineData.modelos).forEach(model => {
          ;["color", "color_hoja", "color_marco"].forEach(key => {
            if (model[key]) model[key].forEach(c => colors.add(c))
          })
        })
        return [...colors]
      }

      return []
    }
  }

  const marcos = getMarcosDisponibles(productoForm.category, productoForm.line)

  
  return (
    <Layout>
      <form onSubmit={handleSubmit(onSubmit)} >
        <div className="page-banner">Nuevo Pedido</div>
        <section className="page-section">        
          <div className="addpedido">
            <h2>Datos del Cliente</h2>
            <div className="addpedido-cliente-grid">
              <div className="field-group">
                <InputFieldLogin
                  type="number"
                  placeholder="N° pedido"
                  {...register("n_pedido", {
                  required: "Campo obligatorio",
                  min: { value: 100000, message: "Mínimo 6 dígitos" }
                  })}
                  error={errors.n_pedido}
                />
                {errors.n_pedido && <p className="error-msg">{errors.n_pedido.message}</p>}
              </div>

              <div className="field-group">
                <InputFieldLogin
                  type="text"
                  placeholder="Nombre / Razón Social"
                  {...register("nombre", {
                  required: "Campo obligatorio",
                  minLength: { value: 3, message: "Mínimo 3 caracteres" }
                  })}
                  error={errors.nombre}
                />
                {errors.nombre && <p className="error-msg">{errors.nombre.message}</p>}
              </div>

              <div className="field-group">
                <InputFieldLogin
                  type="text"
                  placeholder="DNI / CUIT"
                  {...register("identificacion", {
                  required: "Campo obligatorio",
                  validate: v => /^\d{8,11}$/.test(v) || "Entre 8 y 11 números"
                  })}
                  error={errors.identificacion}
                />
                {errors.identificacion && <p className="error-msg ">{errors.identificacion.message}</p>}
              </div>

              <div className="field-group">
                <InputFieldLogin
                    type="text"
                  placeholder="Domicilio y N°"
                  {...register("domicilio", {
                  required: "Campo obligatorio",
                  minLength: { value: 10, message: "Mínimo 10 caracteres" }
                  })}
                  error={errors.domicilio}
                />
                {errors.domicilio && <p className="error-msg ">{errors.domicilio.message}</p>}
              </div>

              <div className="field-group">
                <select
                  {...register("estado", { required: "Campo obligatorio" })}    
                  >
                  <option value="">Seleccionar estado</option>
                  {ORDEN_ESTADOS.map(s => (
                    <option key={s.id} value={s.value}>{s.content}</option>
                  ))}
                </select>
                {errors.estado && <p className="error-msg">{errors.estado.message}</p>}
              </div>        
            </div>
          </div>

        
          <div className="addpedido"> 
            <h3>Agregar Producto</h3>
            <div className="addpedido-producto-grid">
              <InputFieldLogin                
                type="number"
                name="cantidad"
                placeholder="Cantidad"
                value={productoForm.cantidad}
                onChange={handleProductoChange}
              />
              
             <select name="category" value={productoForm.category} onChange={handleProductoChange}>
                <option value="">Seleccionar Categoría</option>
                <option value="Interior">Interior</option>
                <option value="Exterior">Exterior</option>
              </select>

              <select name="line" value={productoForm.line} onChange={handleProductoChange}>
                <option value="">Seleccionar Línea</option>
                {productoForm.category &&
                Object.keys(PUERTAS[productoForm.category].Lineas).map(l => (
                <option key={l} value={l}>{l}</option>
                ))}
              </select>

              <select name="model" value={productoForm.model} onChange={handleProductoChange}>
                <option value="">Seleccionar Modelo</option>
                {productoForm.line &&
                Object.keys(PUERTAS[productoForm.category].Lineas[productoForm.line].modelos || {}).map(m => (
                <option key={m} value={m}>{m}</option>
                ))}
              </select>

              {/* MARCO */}
              <select
                name="marco"
                value={productoForm.marco}
                onChange={handleProductoChange}
                disabled={!productoForm.line}
              >
                <option value="">Seleccionar Marco</option>
                {marcos.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>

              {/* COLOR */}
              <select
                name="color"
                value={productoForm.color}
                onChange={handleProductoChange}
                disabled={!productoForm.category || !productoForm.line}
              >
                <option value="">Seleccionar Color</option>
                {getAvailableColors(productoForm.category, productoForm.line)
                  ?.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
              </select>

              {/* MANO */}
              <select
                name="mano"
                value={productoForm.mano}
                onChange={handleProductoChange}
              >
                <option value="">Seleccione Mano</option>
                {getManos().map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>

              <InputFieldLogin
                type="number"
                name="precio"
                placeholder="Precio total"
                value={productoForm.precio}
                onChange={handleProductoChange}
              />
            </div>
              

            <button type="button" className="btn-add" onClick={agregarProducto}>
              ➕ Agregar producto
            </button>
          </div>

          
          <div className="tabla-productos">
            <h3>Productos cargados</h3>

            {productos.length === 0 && <p>No hay productos agregados.</p>}

            {productos.length > 0 && (
              <table>
                <thead>
                  <tr>
                    <th>Cant</th>
                    <th>Categoría</th>
                    <th>Línea</th>
                    <th>Modelo</th>
                    <th>Marco</th>
                    <th>Color</th>
                    <th>Mano</th>
                    <th>Precio</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((p, i) => (
                    <tr key={i}>
                      <td>{p.cantidad}</td>
                      <td>{p.category}</td>
                      <td>{p.line}</td>
                      <td>{p.model}</td>
                      <td>{p.marco}</td>
                      <td>{p.color}</td>
                      <td>{p.mano}</td>
                      <td>${p.precio}</td>
                      <td>
                        <button
                          type="button"
                          className="btn-delete"
                          onClick={() => eliminarProducto(i)}
                        >
                          ❌
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          
          <button className="btn-save" type="submit">
            💾 Guardar pedido completo
          </button>

          </section>
        </form>
    </Layout>
  )
}
// COMENTARIO 
export default AddPedido
