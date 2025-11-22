import React, { useState, useEffect } from "react";
import axios from "axios";
import "./estilos.css";

export default function AdminPanel({ onLogout }) {
  const token = localStorage.getItem("token");
  const [tab, setTab] = useState("clientes");

  // ---------------- ESTADOS ----------------
  const [clientes, setClientes] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [detalleVenta, setDetalleVenta] = useState([]);

  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);

  const [ventaForm, setVentaForm] = useState({ ID_cliente: "", productos: [] });
  const [fechaVenta, setFechaVenta] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [total, setTotal] = useState(0);

  // ---------------- FECHA AUTOMÁTICA ----------------
  useEffect(() => {
    const hoy = new Date();
    const fechaFormateada = hoy.toISOString().split("T")[0];
    setFechaVenta(fechaFormateada);
  }, []);

  // ---------------- CARGA DE DATOS ----------------
  const fetchData = async (table) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/${table}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      switch (table) {
        case "clientes": setClientes(res.data); break;
        case "municipios": setMunicipios(res.data); break;
        case "productos": setProductos(res.data); break;
        case "categorias": setCategorias(res.data); break;
        case "ventas": setVentas(res.data); break;
        case "detalle_venta": setDetalleVenta(res.data); break;
        default: break;
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData(tab);
    if (municipios.length === 0) fetchData("municipios");
    if (categorias.length === 0) fetchData("categorias");
    if (productos.length === 0) fetchData("productos");
    if (clientes.length === 0) fetchData("clientes");
  }, [tab]);

  // ---------------- CRUD ----------------
  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (table) => {
    try {
      await axios.post(`http://localhost:5000/api/admin/${table}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Registro agregado correctamente");
      setForm({});
      fetchData(table);
    } catch (err) {
      alert("Error al agregar: " + (err.response?.data?.error || err.message));
    }
  };

  const handleUpdate = async (table, idField, id) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/${table}/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Registro actualizado correctamente");
      setForm({});
      setEditingId(null);
      fetchData(table);
    } catch (err) {
      alert("Error al actualizar: " + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async (table, idField, id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este registro?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/${table}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Registro eliminado correctamente");
      fetchData(table);
    } catch (err) {
      alert("Error al eliminar: " + (err.response?.data?.error || err.message));
    }
  };

  // ---------------- VENTAS ----------------
  const addProductoToVenta = () => {
    if (!productoSeleccionado || cantidad <= 0) {
      alert("Selecciona producto y cantidad válida");
      return;
    }

    const producto = productos.find(p => p.Codigo === productoSeleccionado);
    if (!producto) return;

    const subtotal = producto.Precio * cantidad;
    const newProductos = [...ventaForm.productos, { ...producto, cantidad, subtotal }];

    setVentaForm({ ...ventaForm, productos: newProductos });
    setTotal(newProductos.reduce((acc, p) => acc + p.subtotal, 0));
    setProductoSeleccionado("");
    setCantidad(1);
  };

  const removeProducto = (index) => {
    const newProductos = ventaForm.productos.filter((_, i) => i !== index);
    setVentaForm({ ...ventaForm, productos: newProductos });
    setTotal(newProductos.reduce((acc, p) => acc + p.subtotal, 0));
  };

  const imprimirTicket = () => {
    const cliente = clientes.find(c => c.ID_cliente === parseInt(ventaForm.ID_cliente));

    const contenido = `
      <div style="font-family: Arial; padding: 10px; width: 300px;">
        <h3 style="text-align:center;">Ticket de Venta</h3>
        <p><strong>Cliente:</strong> ${cliente?.Nombre || 'Cliente'} ${cliente?.Apellido || ''}</p>
        <p><strong>Fecha:</strong> ${fechaVenta}</p>
        <hr/>
        <table style="width:100%; font-size:14px;">
          <thead>
            <tr>
              <th style="text-align:left;">Producto</th>
              <th>Cant</th>
              <th>Precio</th>
              <th>Sub</th>
            </tr>
          </thead>
          <tbody>
            ${ventaForm.productos.map(p => `
              <tr>
                <td>${p.Nombre_producto}</td>
                <td>${p.cantidad}</td>
                <td>$${p.Precio.toFixed(2)}</td>
                <td>$${p.subtotal.toFixed(2)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
        <hr/>
        <h4 style="text-align:right;">Total: $${total.toFixed(2)}</h4>
      </div>
    `;

    const ventana = window.open("", "PRINT", "height=400,width=300");
    ventana.document.write(`<html><head><title>Ticket</title></head><body>${contenido}</body></html>`);
    ventana.document.close();
    ventana.print();
  };

  const handleGuardarVenta = async () => {
    if (!ventaForm.ID_cliente || ventaForm.productos.length === 0) {
      alert("Selecciona cliente y productos");
      return;
    }

    try {
      const ventaRes = await axios.post(`http://localhost:5000/api/admin/ventas`, {
        ID_cliente: ventaForm.ID_cliente,
        Fecha_venta: fechaVenta,
        Total_pago: total
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const ID_venta = ventaRes.data.ID_venta;

      for (let p of ventaForm.productos) {
        await axios.post(`http://localhost:5000/api/admin/detalle_venta`, {
          ID_venta,
          Codigo_producto: p.Codigo,
          Cantidad: p.cantidad,
          Precio_unitario: p.Precio,
          Subtotal: p.subtotal
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      alert("Venta registrada correctamente");
      imprimirTicket();
      setVentaForm({ ID_cliente: "", productos: [] });
      setTotal(0);
      setFechaVenta(new Date().toISOString().split("T")[0]);

      fetchData("ventas");
      fetchData("detalle_venta");
    } catch (err) {
      alert("Error al guardar venta: " + (err.response?.data?.error || err.message));
    }
  };

  // ---------------- TABLAS ----------------
  const renderTable = () => {
    let data = [];
    let fields = [];
    let idField = "";
    let showId = false;

    switch (tab) {
      case "clientes":
        data = clientes;
        fields = ["Nombre", "Apellido", "Telefono"];
        idField = "ID_cliente";
        break;
      case "municipios":
        data = municipios;
        fields = ["Nombre_municipio"];
        idField = "ID_municipio";
        break;
      case "categorias":
        data = categorias;
        fields = ["Nombre_categoria"];
        idField = "ID_categoria";
        break;
      case "productos":
        data = productos;
        fields = ["Codigo", "Nombre_producto", "Precio", "Existencia"];
        idField = "Codigo";
        showId = true;
        break;
      case "ventas":
        data = ventas;
        fields = ["ID_cliente", "Fecha_venta", "Total_pago"];
        idField = "ID_venta";
        showId = true;
        break;
      case "detalle_venta":
        data = detalleVenta;
        fields = ["ID_venta", "Codigo_producto", "Cantidad", "Precio_unitario", "Subtotal"];
        idField = "ID_detalle";
        break;
      default:
        break;
    }

    const showGenericForm = tab !== "detalle_venta" && tab !== "ventas";
    const showActions = tab !== "detalle_venta";

    return (
      <div>
        <h2>{tab.toUpperCase()}</h2>

        {/* -------- FORMULARIO -------- */}
        {showGenericForm && (
          <div className="form-add">
            <h4>{editingId ? "Editar Registro" : "Agregar Registro"}</h4>

            {fields.filter(f => f !== idField).map(f => (
              <input
                key={f}
                name={f}
                placeholder={f}
                type={f.includes("Fecha") ? "date" : "text"}
                value={form[f] || ""}
                onChange={handleInputChange}
              />
            ))}

            {tab === "clientes" && (
              <select name="ID_municipio" value={form.ID_municipio || ""} onChange={handleInputChange}>
                <option value="">Selecciona municipio</option>
                {municipios.map(m => (
                  <option key={m.ID_municipio} value={m.ID_municipio}>{m.Nombre_municipio}</option>
                ))}
              </select>
            )}

            {tab === "productos" && (
              <select name="ID_categoria" value={form.ID_categoria || ""} onChange={handleInputChange}>
                <option value="">Selecciona categoría</option>
                {categorias.map(c => (
                  <option key={c.ID_categoria} value={c.ID_categoria}>{c.Nombre_categoria}</option>
                ))}
              </select>
            )}

            <div style={{ marginTop: '10px' }}>
              {editingId ? (
                <>
                  <button className="btn-save" onClick={() => handleUpdate(tab, idField, editingId)}>Guardar Cambios</button>
                  <button className="btn-delete" onClick={() => { setEditingId(null); setForm({}); }}>Cancelar</button>
                </>
              ) : (
                <button className="btn-save" onClick={() => handleAdd(tab)}>Agregar Nuevo</button>
              )}
            </div>
          </div>
        )}

        {/* -------- TABLA -------- */}
        <table>
          <thead>
            <tr>
              {showId && <th>ID</th>}
              {fields.filter(f => f !== idField).map(h => <th key={h}>{h}</th>)}
              {showActions && <th>Acciones</th>}
            </tr>
          </thead>

          <tbody>
            {data.map(row => (
              <tr key={row[idField]}>
                {showId && <td>{row[idField]}</td>}

                {fields.filter(f => f !== idField).map(f => {

                  if (tab === "ventas" && f === "ID_cliente") {
                    const cliente = clientes.find(c => c.ID_cliente === row.ID_cliente);
                    return (
                      <td key={f}>{cliente ? `${cliente.Nombre} ${cliente.Apellido}` : "Sin datos"}</td>
                    );
                  }

                  if (tab === "detalle_venta" && f === "ID_venta") {
                    const venta = ventas.find(v => v.ID_venta === row.ID_venta);
                    const cliente = clientes.find(c => c.ID_cliente === venta?.ID_cliente);
                    return (
                      <td key={f}>{cliente ? `${cliente.Nombre} ${cliente.Apellido}` : row[f]}</td>
                    );
                  }

                  return <td key={f}>{row[f]}</td>;
                })}

                {showActions && (
                  <td>
                    {/* ❌ QUITAR EDITAR EXCLUSIVAMENTE EN TABLA VENTAS */}
                    {tab !== "ventas" && (
                      <button
                        className="btn-edit"
                        onClick={() => {
                          setForm(row);
                          setEditingId(row[idField]);
                        }}
                      >
                        Editar
                      </button>
                    )}

                    {/* SIEMPRE ELIMINAR */}
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(tab, idField, row[idField])}
                    >
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // ---------------- FORM VENTAS ----------------
  const renderVentaForm = () => (
    <div className="venta-form">
      <h3>Registrar Nueva Venta</h3>

      <label>Cliente:</label>
      <select
        value={ventaForm.ID_cliente}
        onChange={(e) => setVentaForm({ ...ventaForm, ID_cliente: e.target.value })}
      >
        <option value="">Selecciona cliente</option>
        {clientes.map(c => (
          <option key={c.ID_cliente} value={c.ID_cliente}>
            {c.Nombre} {c.Apellido}
          </option>
        ))}
      </select>

      <label>Fecha de Venta:</label>
      <input
        type="date"
        value={fechaVenta}
        onChange={(e) => setFechaVenta(e.target.value)}
      />

      <div className="producto-add">
        <label>Producto:</label>
        <select
          value={productoSeleccionado}
          onChange={(e) => setProductoSeleccionado(e.target.value)}
        >
          <option value="">Selecciona producto</option>
          {productos.map(p => (
            <option key={p.Codigo} value={p.Codigo}>{p.Nombre_producto}</option>
          ))}
        </select>

        <input
          type="number"
          min="1"
          value={cantidad}
          onChange={(e) => setCantidad(parseInt(e.target.value))}
        />

        <button className="btn-save" onClick={addProductoToVenta}>+ Agregar Producto</button>
      </div>

      <h4>Resumen de Productos</h4>
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Subtotal</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {ventaForm.productos.map((p, i) => (
            <tr key={i}>
              <td>{p.Nombre_producto}</td>
              <td>{p.cantidad}</td>
              <td>${p.Precio.toFixed(2)}</td>
              <td>${p.subtotal.toFixed(2)}</td>
              <td><button className="btn-delete" onClick={() => removeProducto(i)}>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Total: ${total.toFixed(2)}</h4>
      <button className="btn-save" onClick={handleGuardarVenta}>Guardar Venta</button>
    </div>
  );

  return (
    <div className="admin-panel">
      <h1>Panel de Administrador</h1>
      {onLogout && <button className="btn-delete" onClick={onLogout} style={{ float: 'right' }}>Cerrar Sesión</button>}

      <div className="tabs">
        {["clientes", "municipios", "productos", "categorias", "ventas", "detalle_venta"].map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); setEditingId(null); setForm({}); }}
            className={tab === t ? "active" : ""}
          >
            {t.toUpperCase().replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {renderTable()}
        {tab === "ventas" && !editingId && renderVentaForm()}
      </div>
    </div>
  );
}
