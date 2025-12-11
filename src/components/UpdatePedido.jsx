import "../styles/updatePedido.css"
import DetalleEdicionProductoUnico from "./DetalleEdicionProductoUnico"
import TablaEdicionMultiple from "./TablaEdicionMultiple"

const UpdatePedido = ({ pedido, onClose, onUpdate }) => {
 
  const cantidadProductos = pedido.productos.length
 

  if (cantidadProductos === 1) {
    return (
      <DetalleEdicionProductoUnico
        pedido={pedido}
        onClose={onClose}
        onUpdate={onUpdate}
        productoInicial={pedido.productos[0]}
        indiceProducto={0}
      />
    )
  }

  
  if (cantidadProductos > 1) {
    return <TablaEdicionMultiple pedido={pedido} onClose={onClose} onUpdate={onUpdate} />
  }

  
  return (
      <div className="modal-overlay-update">
        <div className="modal-box-update">
          <p>Este pedido no contiene productos para editar.</p>
          <button onClick={onClose}>Cerrar</button>
        </div>
      </div>
    )
}


export default UpdatePedido
