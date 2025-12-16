import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import InputFieldLogin from "./InputFieldLogin"
import { ORDEN_ESTADOS } from "../constants/estados"
import { PUERTAS } from "../constants/puertas"
import "../styles/updatePedido.css" 

const DetalleEdicionProductoUnico = ({
  pedido,
  productoInicial,
  onClose,
  onUpdate,
  indiceProducto,
  onProductUpdatedLocally
}) => {
  const [loader, setLoader] = useState(false)  
  
  const pedidoId = pedido._id
  {pedidoId} 

  const [productoUpdateForm, setProductoUpdateForm] = useState({
    cantidad: productoInicial.cantidad || "",
    category: productoInicial.category || "",
    line: productoInicial.line || "",
    model: productoInicial.model || "",
    marco: productoInicial.marco || "",
    color: productoInicial.color || "",
    mano: productoInicial.mano || "",
    precio: productoInicial.precio || "",
    estado: productoInicial.estado || "",
    nPedido: pedido.n_pedido || ""
  })

  const { token } = useAuth()

  const handleProductoChange = (e, v) => {
    if (typeof e === "string") e = { target: { name: e, value: v } }

    setProductoUpdateForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

    
  function getMarcosDisponibles(category, line) {
    if (!category || !line) return []
    if (category === "Exterior") return []

    const lineaDatos = PUERTAS.Interior.Lineas[line]
    if (lineaDatos?.Marcos) return Object.keys(lineaDatos.Marcos)

    let tieneChapa24 = false

    if (lineaDatos?.modelos) {
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
      return lineData.Color || cat.Color || []
    }

    if (category === "Exterior") {
      const lineData = cat.Lineas[line]
      if (lineData?.general?.color) return lineData.general.color

      let colors = new Set()
      Object.values(lineData.modelos || {}).forEach(model => {
        ;["color", "color_hoja", "color_marco"].forEach(k => {
          if (model[k]) model[k].forEach(c => colors.add(c))
        })
      })
      return [...colors]
    }
  }
    
  const marcos = getMarcosDisponibles(productoUpdateForm.category, productoUpdateForm.line)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const dataToUpdate = {    
      indice: indiceProducto,
      productoUpdate:{
        cantidad: Number(productoUpdateForm.cantidad),
        category: productoUpdateForm.category,
        line: productoUpdateForm.line,
        model:productoUpdateForm.model,
        color: productoUpdateForm.color,
        mano: productoUpdateForm.mano,
        precio: Number(productoUpdateForm.precio),
        ...(productoUpdateForm.category !== "Exterior" && { marco: productoUpdateForm.marco }),
      },
      estado: productoUpdateForm.estado,
    }
        
    try {
      setLoader(true)
      console.log()
      //  const res = await fetch(`http://localhost:3000/pedidos/${pedidoId}`, {
      //     method: "PATCH",
      //     headers: {
      //         "Content-Type": "application/json",
      //         "Authorization": `Bearer ${token}`
      //     },
      //     body: JSON.stringify(dataToUpdate)
      // })

      const res = await fetch(`https://backend-utn-2025.onrender.com/pedidos/${pedidoId}`, {
          method: "PATCH",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(dataToUpdate)
      })


      if (!res.ok) { return alert("❌ Error al actualizar el pedido") }
      
      const updatedPedido = await res.json();
      
      if (onProductUpdatedLocally) {
        //varios producto
        const productosActualizados = updatedPedido.data?.productos || updatedPedido.productos;
            
        if (productosActualizados && indiceProducto !== null) {
          const productoRecienGuardado = productosActualizados[indiceProducto];
          onProductUpdatedLocally(indiceProducto, productoRecienGuardado);
        } else {
          alert("❌ Error al actualizar el pedido")
        }
      }       
      onUpdate()
      onClose()  
    } catch (error) {
       alert("❌ Error al actualizar el pedido , error")        
    } finally {
        setLoader(false)
    }
  }

  return (
        
        <section className="modal-overlay-update product-detail-modal"> 
            <div className="modal-box-update">
                <h2>Editar Producto N°: {productoUpdateForm.nPedido}</h2>                

                <form className="form-container-update" onSubmit={handleSubmit}>
                    <div className="form-grid-update">

                        <InputFieldLogin
                            type="number"
                            placeholder="Cantidad"
                            name="cantidad"
                            onChange={handleProductoChange}
                            value={productoUpdateForm.cantidad}
                        />

                        {/* SELECT: Categoría */}
                        <select
                            name="category"
                            value={productoUpdateForm.category}
                            onChange={e => {
                              handleProductoChange("category", e.target.value)
                              handleProductoChange("line", "")
                              handleProductoChange("model", "")
                              if (value === "Exterior") { handleProductoChange("marco", "") }
                        }}
                        >
                            <option value="">Categoría</option>
                            <option value="Interior">Interior</option>
                            <option value="Exterior">Exterior</option>
                        </select>

                        {/* SELECT: Línea */}
                        <select
                            name="line"
                            value={productoUpdateForm.line}
                            disabled={!productoUpdateForm.category}
                            onChange={e => {
                                handleProductoChange("line", e.target.value)
                                handleProductoChange("model", "")
                            }}
                        >
                            <option value="">Línea</option>
                            {productoUpdateForm.category &&
                                Object.keys(PUERTAS[productoUpdateForm.category].Lineas).map(l => (
                                    <option key={l} value={l}>{l}</option>
                                ))}
                        </select>

                        {/* SELECT: Modelo */}
                        <select
                            name="model"
                            value={productoUpdateForm.model}
                            disabled={!productoUpdateForm.line}
                            onChange={e => handleProductoChange("model", e.target.value)}
                        >
                            <option value="">Modelo</option>
                            {(() => {
                                const data =
                                    productoUpdateForm.category === "Interior"
                                        ? PUERTAS.Interior.Lineas[productoUpdateForm.line]?.modelos
                                        : PUERTAS.Exterior.Lineas[productoUpdateForm.line]?.modelos

                                if (!data) return []
                                const modelos = Array.isArray(data) ? data : Object.keys(data)

                                return modelos.map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))
                            })()}
                        </select>

                        {/* SELECT: Marco */}
                        <select
                            name="marco"
                            value={productoUpdateForm.marco}
                            onChange={handleProductoChange}
                            disabled={!productoUpdateForm.line}
                        >
                            <option value="">Marco</option>
                            {marcos.map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>

                        {/* SELECT: Color */}
                        <select
                            name="color"
                            value={productoUpdateForm.color}
                            onChange={handleProductoChange}
                            disabled={!productoUpdateForm.category || !productoUpdateForm.line}
                        >
                            <option value="">Color</option>
                            {getAvailableColors(productoUpdateForm.category, productoUpdateForm.line)
                                ?.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                        </select>

                        {/* SELECT: Mano */}
                        <select
                            name="mano"
                            value={productoUpdateForm.mano}
                            onChange={handleProductoChange}
                        >
                            <option value="">Mano</option>
                            {getManos().map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>

                        {/* INPUT: Precio total */}
                        <InputFieldLogin
                            type="number"
                            placeholder="Precio total (del producto)"
                            name="precio"
                            onChange={handleProductoChange}
                            value={productoUpdateForm.precio}
                        />

                        {/* SELECT: Estado */}
                        <select
                            name="estado"
                            value={productoUpdateForm.estado}
                            onChange={handleProductoChange}
                        >
                            <option value="">Estado</option>
                            {ORDEN_ESTADOS.map(s => (
                                <option key={s.id} value={s.value}>{s.content}</option>
                            ))}
                        </select>
                    </div>

                    <button className="btn-primary" type="submit" disabled={loader}>
                        {loader ? "Actualizando..." : "Guardar Producto"}
                    </button>
                </form>

                <button className="close-btn-update" type="button" onClick={onClose}>
                    Cancelar
                </button>
            </div>
        </section>
  )
}

export default DetalleEdicionProductoUnico