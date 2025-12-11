import { useState } from "react"
import Layout from "../components/Layout"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import InputFieldLogin from "../components/InputFieldLogin"
import { ORDEN_ESTADOS } from "../constants/estados"
import { PUERTAS } from "../constants/puertas"
import "../styles/addPedido.css"

const AddPedido = () => {
  const [cliente, setCliente] = useState({
    n_pedido: "",
    nombre: "",
    identificacion: "",
    domicilio: "",
    estado: ""
  })

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

 
  const handleClienteChange = (e) => {
    setCliente(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }
  const handleProductoChange = (e, v) => {
    if (typeof e === "string") e = { target: { name: e, value: v } }

    setProductoForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }  
  const agregarProducto = () => {
    if (!productoForm.category || !productoForm.line || !productoForm.model) {
      alert("⚠ Debes seleccionar categoría, línea y modelo")
      return
    }

    setProductos(prev => [...prev, productoForm])
    setProductoForm({
        cantidad:"",
        category: "",
        line: "",
        model: "",
        marco: "",
        color: "",
        mano: "",
        precio:""
    })
   
    
  }
  
  const eliminarProducto = (index) => {
    setProductos(prev => prev.filter((_, i) => i !== index))
  }

  
  const handleGuardarPedido = async (e) => {
  e.preventDefault();

  if (productos.length === 0) {
    console.log(productos)
    alert("⚠ Debes agregar al menos 1 producto");
    return;
  }

  
  const productosType = productos.map(p => ({
      ...p,
      cantidad: Number(p.cantidad),
      precio: Number(p.precio)
    }));

    
    const pedidoAEnviar = {
      n_pedido: Number(cliente.n_pedido),
      cliente: {
        nombre: cliente.nombre,
        identificacion: cliente.identificacion,
        domicilio: cliente.domicilio
      },
      estado: cliente.estado,
      productos: productosType
    };

    try {
      console.log(pedidoAEnviar);

      const res = await fetch("http://localhost:3000/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(pedidoAEnviar)
      });

      if (!res.ok) {
        alert("❌ Error al guardar el pedido");
        return;
      }

      alert("✅ Pedido guardado correctamente");
      
      setCliente({
        n_pedido: "",
        nombre: "",
        identificacion: "",
        domicilio: "",
        estado: ""
      });      
      setProductoForm({
        cantidad: "",
        category: "",
        line: "",
        model: "",
        marco: "",
        color: "",
        mano: "",
        precio: ""
      });

      navigate("/");

    } catch (err) {
      console.log(err);
      alert("❌ Error de conexión");
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
      <div className="page-banner">Nuevo Pedido</div>

      <section className="page-section">

        
        <div className="addpedido">
          <h2>Datos del Cliente</h2>

          <div className="addpedido-cliente-grid">

            <InputFieldLogin
              type="number"
              placeholder="N° pedido"
              name="n_pedido"
              onChange={handleClienteChange}
              value={cliente.n_pedido === null || cliente.n_pedido === "" ? "" : cliente.n_pedido}

            />

            <InputFieldLogin
              type="text"
              placeholder="Nombre / Razón Social"
              name="nombre"
              onChange={handleClienteChange}
              value={cliente.nombre}
            />

            <InputFieldLogin
              type="text"
              placeholder="DNI / CUIT"
              name="identificacion"
              onChange={handleClienteChange}
              value={cliente.identificacion}
            />

            <InputFieldLogin
              type="text"
              placeholder="Domicilio y N°"
              name="domicilio"
              onChange={handleClienteChange}
              value={cliente.domicilio}
            />

            <select
              name="estado"
              value={cliente.estado}
              onChange={handleClienteChange}
            >
              <option value="">Seleccionar estado</option>
              {ORDEN_ESTADOS.map(s => (
                <option key={s.id} value={s.value}>{s.content}</option>
              ))}
            </select>
          </div>
        </div>

       
        <div className="addpedido">
          <h3>Agregar Producto</h3>

          <div className="addpedido-producto-grid">

            <InputFieldLogin
              type="number"
              placeholder="Cantidad"
              name="cantidad"
              onChange={handleProductoChange}
              value={productoForm.cantidad || ""}
              
            />

            <select
              name="category"
              value={productoForm.category}
              onChange={e => {
                handleProductoChange("category", e.target.value)
                handleProductoChange("line", "")
                handleProductoChange("model", "")
              }}
            >
              <option value="">Seleccionar Categoría</option>
              <option value="Interior">Interior</option>
              <option value="Exterior">Exterior</option>
            </select>

            <select
              name="line"
              value={productoForm.line}
              disabled={!productoForm.category}
              onChange={e => {
                handleProductoChange("line", e.target.value)
                handleProductoChange("model", "")
              }}
            >
              <option value="">Seleccionar Línea</option>
              {productoForm.category &&
                Object.keys(
                  productoForm.category === "Interior"
                    ? PUERTAS.Interior.Lineas
                    : PUERTAS.Exterior.Lineas
                ).map(l => (
                  <option key={l} value={l}>{l}</option>
                ))
              }
            </select>

            {/* MODELOS */}
            <select
              name="model"
              value={productoForm.model}
              disabled={!productoForm.line}
              onChange={e => handleProductoChange("model", e.target.value)}
            >
              <option value="">Seleccionar modelo</option>
              {(() => {
                let modelos = []

                if (productoForm.line) {
                  const data =
                    productoForm.category === "Interior"
                      ? PUERTAS.Interior.Lineas[productoForm.line]?.modelos
                      : PUERTAS.Exterior.Lineas[productoForm.line]?.modelos

                  modelos = Array.isArray(data) ? data : Object.keys(data || {})
                }

                return modelos.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))
              })()}
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
              placeholder="Precio total"
              name="precio"
              onChange={handleProductoChange}
              value={productoForm.precio || ""}
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

        
        <button className="btn-save" onClick={handleGuardarPedido}>
          💾 Guardar pedido completo
        </button>

      </section>
    </Layout>
  )
}
// COMENTARIO 
export default AddPedido
