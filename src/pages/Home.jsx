import { useEffect, useState } from "react"
import Layout from "../components/Layout"
import UpdatePedido from "../components/UpdatePedido"
import { useAuth } from "../context/AuthContext"
import { ToastMessage } from "../components/ToastMessage.jsx"
import { PUERTAS } from "../constants/puertas.js"
import { ORDEN_ESTADOS } from "../constants/estados.js"
import "../styles/home.css"

const Home = () => {
  const initialErrorState = {
    success: null,
    notification: null,
    error: {
      fetch: null,
      delete: null
    }
  }

  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [filters, setFilters] = useState({
    nPedido:"",
    name: "",
    identification:"",
    category: "",
    line: "",
    model: "",
    minCant: "",   //0
    maxCant: "",    //0
    order_status:""
  })  

  
 
  
  const [responseServer, setResponseServer] = useState(initialErrorState)

  // { id: '6925fe9645e9b029b62ac797', iat: 1764101665, exp: 1764105265 }
  const { user, token } = useAuth()

  const fetchingOrders = async (query = "") => {
    setResponseServer(initialErrorState)
    try {
      const response = await fetch(`http://localhost:3000/pedidos?${query}`, {
        method: "GET"
      })
      const dataOrders = await response.json()
      // console.log(dataOrders)
      setOrders(dataOrders.data.reverse())
      setResponseServer({
        success: true,
        notification: "Exito al cargar los pedidos",
        error: {
          ...responseServer.error,
          fetch: true
        }
      })
    } catch (e) {
      setResponseServer({
        success: false,
        notification: "Error al traer los datos",
        error: {
          ...responseServer.error,
          fetch: false
        }
      })
    }
  }

  useEffect(() => {
    fetchingOrders()
  }, [])

  //comentario para git, porque no me esta guardando 
  
  const deleteOrder = async (idOrder) => {
    if (!confirm("¿Esta seguro de que quieres borrar el pedido?")) {
      return
    }

    try {
      const response = await fetch(`http://localhost:3000/pedidos/${idOrder}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      const dataResponse = await response.json()

      if (dataResponse.error) {
        alert(dataResponse.error)
        return
      }

      setOrders(orders.filter((p) => p._id !== idOrder))
      
      alert(`Pedido N°: ${dataResponse.data.n_pedido}, borrado con éxito.`)
    } catch (error) {
      // setResponseServer({ ...error, delete: "Error al borrar el producto." })
    }
  }

  const handleUpdateOrder = (p) => {
    setSelectedOrder(p)
  }

  const handleChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  
  const handleSubmit = (e) => {
    e.preventDefault()
    const query = new URLSearchParams()

    Object.entries(filters).forEach(([key, val]) => {
      if (val) query.append(key, val)
    });
    console.log(filters)
    fetchingOrders(query.toString())
  }

  const handleResetFilters = () => {
    setFilters({
      nPedido:"",
      name: "",
      identification:"", //0
      category: "",
      line: "",
      model: "",
      minCant: "",   //0
      maxCant: "",    //0
      estado:""
    })
   
  }
  
  return (
    <Layout>
      
      <div className="page-banner">Pedidos</div>

      <section className="page-section">
        <p>
          ¡Bienvenido {user && user.id}!. Aquí encontrarás todos los pedidos con toda su información.
        </p>
      </section>

      <section>
        <form className="filters-form" onSubmit={handleSubmit}>          
          <input
            type="text"
            name="nPedido"
            placeholder="N° pedido"
            value={filters.nPedido}
            onChange={e => handleChange("nPedido", e.target.value)}
          />          
          <input
            type="text"
            name="name"
            placeholder="Nombre cliente"
            value={filters.name}
            onChange={e => handleChange("name", e.target.value)}
          />         
          <input
            type="number"
            name="identification"
            placeholder="Identificación - DNI / CUIT"
            value={filters.identification}
            onChange={e => handleChange("identification", e.target.value)}
          />

          {/* Categoría */}
          <select
            
            value={filters.category}
            onChange={e => {
              console.log("category change:", e.target.value);
              handleChange("category", e.target.value);
              handleChange("line", "");
              handleChange("model", "");
            }}
          >
            <option value="">Seleccionar Categoria</option>
            <option value="Interior">Interior</option>
            <option value="Exterior">Exterior</option>
          </select>

          {/* Línea */}
          <select
            value={filters.line}
            onChange={e => {
              handleChange("line", e.target.value);
              handleChange("model", "");
            }}
             disabled={!filters.category}
            
          >
            <option value="">Seleccionar línea…</option>
            {filters.category &&
              
              Object.keys(
                filters.category === "Interior"
                  ? PUERTAS.Interior.Lineas
                  : PUERTAS.Exterior.Lineas
              ).map(l => (
                <option key={l} value={l}>{l}</option>
              ))
            
            }
          </select>
          
          {/* Modelos */}
          {(() => {
            let modelArray = [];
            if (filters.line) {
              const modelos =
                filters.category === "Interior"
                  ? PUERTAS.Interior.Lineas[filters.line]?.modelos
                  : PUERTAS.Exterior.Lineas[filters.line]?.modelos;

              modelArray = Array.isArray(modelos) ? modelos : Object.keys(modelos || {});
            }

            return (
              <select
                value={filters.model}
                onChange={e => {
                  handleChange("model", e.target.value)
                  console.log("category change:", e.target.value);
                }}
                disabled={!filters.line}
              >
                <option value="">Seleccionar modelo</option>
                {modelArray.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            );
          })()}

          
          <input
            type="number"
            name="minCant"
            placeholder="Cantidad mínima"
            value={filters.minCant}
            onChange={e => handleChange("minCant", e.target.value)}
          />          
          <input
            type="number"
            name="maxCant"
            placeholder="Cantidad máxima"
            value={filters.maxCant}
            onChange={e => handleChange("maxCant", e.target.value)}
          />

          {/* Estado */}
          <select
            value={filters.order_status}
            onChange={e => handleChange("order_status", e.target.value)}
          >
            <option value="">Seleccionar estado</option>
            {ORDEN_ESTADOS.map(s => (
              <option key={s.id} value={s.value}>{s.content}</option>
            ))}
          </select>

          {/* Botones */}
          <button type="submit">Aplicar filtros</button>
          <button type="button" onClick={handleResetFilters}>Cancelar</button>
        </form>
      </section>


         

      {
        selectedOrder &&
        <UpdatePedido
          pedido={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdate={fetchingOrders}
        />
      }

      <section className="orders-grid">
        {orders.map((o, i) => (
          <div key={i} className="order-card">

            <h3 className="order-title">Pedido #{o.n_pedido}</h3>
            <p className="order-client">{o.cliente.nombre}</p>

            <div className="order-products">
              <h4>Productos</h4>

              <ul className="product-list">
                {o.productos.map((p, idx) => (
                  <li key={idx} className="product-item">
                    <span className="product-main">
                      {p.cantidad}× {p.model}
                    </span>

                    <span className="product-sub">
                      {p.category} · {p.line} · {p.mano}
                    </span>

                    <span className="product-price">
                      ${p.precio}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="order-status">
              <strong>Estado:</strong> {o.estado}
            </p>

            {user && (
              <div className="cont-btn">
                <button onClick={() => handleUpdateOrder(o)}>Actualizar</button>
                <button onClick={() => deleteOrder(o._id)}>Borrar</button>
              </div>
            )}
          </div>
        ))}
      </section>

      {!responseServer.error.fetch && <ToastMessage color={"red"} msg={responseServer.notification} />}
      {responseServer.success && <ToastMessage color={"green"} msg={responseServer.notification} />}
      
    </Layout>
  )
}

export default Home
