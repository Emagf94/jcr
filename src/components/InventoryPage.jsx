import { useState, useEffect } from 'react';
import {
    Package, Plus, Search, AlertTriangle, List,
    ArrowLeft, Save, Edit, Trash, Archive, DollarSign,
    Box, Tag, MapPin, Barcode
} from 'lucide-react';
import Swal from 'sweetalert2';

// Categories relevant to motorcycle repair
const CATEGORIES = [
    'Aceites & Lubricantes',
    'Llantas & Neumáticos',
    'Frenos',
    'Kit de Arrastre',
    'Motor & Bujías',
    'Eléctrico',
    'Lujos & Accesorios',
    'Filtros',
    'Otros'
];

function InventoryPage({ currentUser }) {
    const [view, setView] = useState('home'); // home, add, list, edit
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [lowStockCount, setLowStockCount] = useState(0);

    // Form State
    const [formData, setFormData] = useState({
        id: '',
        sku: '',
        name: '',
        category: '',
        brand: '',
        quantity: '',
        min_stock: '5',
        buy_price: '',
        sale_price: '',
        location: '',
        description: ''
    });

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost/jcr/api/inventory.php');
            const data = await res.json();
            if (data.status === 'success') {
                setItems(data.data);
                // Calculate low stock
                const low = data.data.filter(i => parseInt(i.quantity) <= parseInt(i.min_stock)).length;
                setLowStockCount(low);
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudo cargar el inventario', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const method = formData.id ? 'PUT' : 'POST';

        try {
            const res = await fetch('http://localhost/jcr/api/inventory.php', {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (data.status === 'success') {
                Swal.fire('Éxito', `Producto ${formData.id ? 'actualizado' : 'creado'} correctamente`, 'success');
                fetchInventory();
                setView('list');
                resetForm();
            } else {
                Swal.fire('Error', data.message || 'Error al guardar', 'error');
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Error de conexión', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`http://localhost/jcr/api/inventory.php?id=${id}`, { method: 'DELETE' });
                const data = await res.json();
                if (data.status === 'success') {
                    Swal.fire('Eliminado', 'Producto eliminado.', 'success');
                    fetchInventory();
                } else {
                    Swal.fire('Error', data.message, 'error');
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const prepareEdit = (item) => {
        setFormData(item);
        setView('add');
    };

    const resetForm = () => {
        setFormData({
            id: '', sku: '', name: '', category: '', brand: '',
            quantity: '', min_stock: '5', buy_price: '', sale_price: '',
            location: '', description: ''
        });
    };

    const generateSku = () => {
        const sku = 'PROD-' + Math.floor(Math.random() * 100000);
        setFormData(prev => ({ ...prev, sku }));
    };

    // --- Render Views ---

    const renderHome = () => (
        <div style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', color: '#fff' }}>
                <Package className="text-primary" size={40} /> Gestión de Inventario
            </h2>

            <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                {/* Big Button: Add */}
                <div onClick={() => { resetForm(); setView('add'); }}
                    className="stat-card hover-scale"
                    style={{ cursor: 'pointer', textAlign: 'center', padding: '3rem 2rem', border: '2px dashed rgba(255,255,255,0.1)' }}>
                    <div style={{ background: 'rgba(99, 102, 241, 0.2)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <Plus size={40} className="text-primary" />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Registrar Repuesto</h3>
                    <p className="text-muted">Ingresa nuevos productos, aceites o refacciones al sistema.</p>
                </div>

                {/* Big Button: List */}
                <div onClick={() => setView('list')}
                    className="stat-card hover-scale"
                    style={{ cursor: 'pointer', textAlign: 'center', padding: '3rem 2rem' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.2)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <List size={40} style={{ color: '#10b981' }} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Inventario General</h3>
                    <p className="text-muted">Ver existencias, editar precios y gestionar stock actual.</p>
                    <div className="badge badge-active" style={{ marginTop: '1rem', display: 'inline-block' }}>{items.length} Productos</div>
                </div>

                {/* Big Button: Low Stock */}
                <div onClick={() => { setSearchTerm(''); setView('list'); /* Filter logic could be added */ }}
                    className="stat-card hover-scale"
                    style={{ cursor: 'pointer', textAlign: 'center', padding: '3rem 2rem' }}>
                    <div style={{ background: 'rgba(239, 68, 68, 0.2)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', position: 'relative' }}>
                        <AlertTriangle size={40} style={{ color: '#ef4444' }} />
                        {lowStockCount > 0 && (
                            <span style={{ position: 'absolute', top: -5, right: -5, background: '#ef4444', color: 'white', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                {lowStockCount}
                            </span>
                        )}
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Bajo Stock</h3>
                    <p className="text-muted">Productos que requieren reabastecimiento urgente.</p>
                </div>
            </div>
        </div>
    );

    const renderForm = () => (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => setView('home')} className="btn-back">
                    <ArrowLeft size={24} />
                </button>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>
                    {formData.id ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="login-card animate-fade-in">
                <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>

                    {/* Identification */}
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label>Código SKU / Barras *</label>
                        <div className="input-wrapper">
                            <input required name="sku" value={formData.sku} onChange={handleInputChange} className="form-control" placeholder="Escanear o generar..." />
                            <Barcode size={20} className="input-icon-right" style={{ cursor: 'pointer', opacity: 0.7 }} onClick={generateSku} title="Generar Aleatorio" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Nombre del Repuesto *</label>
                        <div className="input-wrapper">
                            <input required name="name" value={formData.name} onChange={handleInputChange} className="form-control" placeholder="Ej. Aceite Motul 7100" />
                            <Tag size={18} className="input-icon" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Marca</label>
                        <div className="input-wrapper">
                            <input name="brand" value={formData.brand} onChange={handleInputChange} className="form-control" placeholder="Ej. Motul, Yamaha..." />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Categoría *</label>
                        <div className="input-wrapper">
                            <select required name="category" value={formData.category} onChange={handleInputChange} className="form-control custom-select">
                                <option value="">Seleccione...</option>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Ubicación / Estante</label>
                        <div className="input-wrapper">
                            <input name="location" value={formData.location} onChange={handleInputChange} className="form-control" placeholder="Ej. Estante A-3" />
                            <MapPin size={18} className="input-icon" />
                        </div>
                    </div>

                    {/* Stock & Price */}
                    <div className="form-group">
                        <label>Cantidad Actual *</label>
                        <div className="input-wrapper">
                            <input type="number" required name="quantity" value={formData.quantity} onChange={handleInputChange} className="form-control" />
                            <Box size={18} className="input-icon" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Stock Mínimo</label>
                        <div className="input-wrapper">
                            <input type="number" required name="min_stock" value={formData.min_stock} onChange={handleInputChange} className="form-control" />
                            <AlertTriangle size={18} className="input-icon" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Precio Compra ($)</label>
                        <div className="input-wrapper">
                            <input type="number" required name="buy_price" value={formData.buy_price} onChange={handleInputChange} className="form-control" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Precio Venta ($)</label>
                        <div className="input-wrapper">
                            <input type="number" required name="sale_price" value={formData.sale_price} onChange={handleInputChange} className="form-control" />
                            <DollarSign size={18} className="input-icon" />
                        </div>
                    </div>
                </div>

                <div className="form-group" style={{ marginTop: '1.5rem' }}>
                    <label>Descripción / Notas</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} className="form-control" rows="3" placeholder="Detalles técnicos, compatibilidad..." />
                </div>

                <button disabled={loading} type="submit" className="btn-primary w-full" style={{ marginTop: '2rem' }}>
                    <Save size={20} /> {formData.id ? 'Actualizar Producto' : 'Guardar Producto'}
                </button>
            </form>
        </div>
    );

    const renderList = () => {
        const filtered = items.filter(i =>
            i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            i.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
            i.category.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
            <div style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => setView('home')} className="btn-back">
                        <ArrowLeft size={24} />
                    </button>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Search className="text-muted" size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="text"
                            placeholder="Buscar repuesto..."
                            className="form-control"
                            style={{ paddingLeft: '3rem', width: '100%' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button onClick={() => { resetForm(); setView('add'); }} className="btn-primary">
                        <Plus size={20} /> Crear
                    </button>
                </div>

                <div className="users-table-container">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Categoría</th>
                                <th>Stock</th>
                                <th>Precio Venta</th>
                                <th>Ubicación</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(item => {
                                const isLow = parseInt(item.quantity) <= parseInt(item.min_stock);
                                return (
                                    <tr key={item.id}>
                                        <td>
                                            <div className="user-details">
                                                <span className="name">{item.name}</span>
                                                <span className="username">SKU: {item.sku} • {item.brand}</span>
                                            </div>
                                        </td>
                                        <td><span className="badge badge-active">{item.category}</span></td>
                                        <td>
                                            <span className={`badge ${isLow ? 'badge-suspended' : 'badge-active'}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                {isLow && <AlertTriangle size={12} />}
                                                {item.quantity} unids.
                                            </span>
                                        </td>
                                        <td style={{ fontWeight: 'bold', color: '#10b981' }}>
                                            $ {parseInt(item.sale_price).toLocaleString()}
                                        </td>
                                        <td>{item.location || '-'}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button onClick={() => prepareEdit(item)} className="btn-icon btn-edit" title="Editar">
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(item.id)} className="btn-icon btn-delete" title="Eliminar">
                                                    <Trash size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#aaa' }}>No se encontraron productos.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div style={{ height: '100%', background: 'var(--bg-color)' }}>
            {view === 'home' && renderHome()}
            {view === 'add' && renderForm()}
            {view === 'list' && renderList()}
        </div>
    );
}

export default InventoryPage;
