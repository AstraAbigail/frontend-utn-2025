import React, { useState } from "react"
import DetalleEdicionProductoUnico from "../components/DetalleEdicionProductoUnico"
import "../styles/updatePedido.css"
import "../styles/tablaEdicionMultiple.css"

const TablaEdicionMultiple = ({ pedido, onClose, onUpdate }) => {
  const [productoAEditar, setProductoAEditar] = useState(null) //  pop-up anidado
  const [indiceAEditar, setIndiceAEditar] = useState(null) //indice

  const [productosLocal, setProductosLocal] = useState(pedido.productos) //para refrescar la ui del popup

 
  const handleEditProducto = (producto, indice) => {
    // Abrir el pop-up anidado 
    setProductoAEditar(producto)
    setIndiceAEditar(indice)
    
  }

  const handleCloseDetalle = () => {
    setProductoAEditar(null)
  }
  const handleProductoGuardadoLocal = (indice, productoActualizado) => {    
    setProductosLocal(prevProductos => {
      return prevProductos.map((producto, i) => 
         i === indice ? productoActualizado : producto
       )
      })
  }
  

  return (
    <section className="modal-overlay-update">
      <div className="modal-box-update large-modal">
        <h2>Editar Pedido Múltiple: N° {pedido.n_pedido}</h2>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unit.</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {productosLocal.map((producto, indice) => (
                <tr key={indice}>
                  <td>{producto.line} - {producto.model} - {producto.color} - {producto.mano }</td>
                  <td>{producto.cantidad}</td>
                  <td>${(producto.precio / producto.cantidad).toFixed(2)}</td> 
                  <td>
                    <button type="button" onClick={() => handleEditProducto(producto, indice)}>
                      Editar Detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
           </table>
        </div>       
        
        <div className="action-buttons-footer">
         <button className="close-btn-update" type="button" onClick={onClose}>
            Cancelar
          </button>
        </div>
        
        {/* POP-UP ANIDADO PARA LA EDICIÓN DETALLADA */}
        {productoAEditar && (
          <DetalleEdicionProductoUnico
            pedido={pedido} 
            productoInicial={productoAEditar}            
            onClose={handleCloseDetalle}
            onUpdate={onUpdate} 
            onProductUpdatedLocally={handleProductoGuardadoLocal}
            indiceProducto={indiceAEditar}
          />
        )}
      </div>
    </section>
  )
}

export default TablaEdicionMultiple