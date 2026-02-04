import { useState, useEffect } from 'react';
import {
    ShoppingCart, Tag, DollarSign, Package,
    Calendar, User, Plus, Search, Archive, AlertTriangle
} from 'lucide-react';
import Swal from 'sweetalert2';

function SalesPage({ currentUser }) {
    const [view, setView] = useState('pos'); // pos, history
    const [products, setProducts] = useState([]);
    const [salesHistory, setSalesHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (view === 'pos') fetchProducts();
        if (view === 'history') fetchHistory();
    }, [view]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost/jcr/api/inventory.php');
            const data = await res.json();
            if (data.status === 'success') {
                // Only show items with stock > 0
                setProducts(data.data.filter(p => parseInt(p.quantity) > 0));
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost/jcr/api/sales.php');
            const data = await res.json();
            if (data.status === 'success') setSalesHistory(data.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleSell = async (product) => {
        const { value: quantity } = await Swal.fire({
            title: `Vender ${product.name}`,
            text: `Stock disponible: ${product.quantity}`,
            input: 'number',
            inputLabel: 'Cantidad',
            inputValue: 1,
            inputAttributes: {
                min: 1,
                max: product.quantity,
                step: 1
            },
            showCancelButton: true,
            confirmButtonText: 'Confirmar Venta',
            cancelButtonText: 'Cancelar',
            preConfirm: (val) => {
                if (!val || val < 1) Swal.showValidationMessage('Cantidad inválida');
                if (parseInt(val) > parseInt(product.quantity)) Swal.showValidationMessage('Excede stock disponible');
                return val;
            }
        });

        if (quantity) {
            confirmSale(product, parseInt(quantity));
        }
    };

    const confirmSale = async (product, qty) => {
        const total = qty * product.sale_price;
        const confirm = await Swal.fire({
            title: 'Confirmar Venta',
            html: `
                <div style="text-align:left; font-size: 1.1em;">
                    <p><strong>Producto:</strong> ${product.name}</p>
                    <p><strong>Cantidad:</strong> ${qty}</p>
                    <p><strong>Precio Unit:</strong> $${parseInt(product.sale_price).toLocaleString()}</p>
                    <hr style="margin: 10px 0; border-color: #555;">
                    <p style="font-size: 1.3em; color: #10b981;"><strong>Total: $${total.toLocaleString()}</strong></p>
                </div>
            `,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Sí, Vender',
            confirmButtonColor: '#10b981'
        });

        if (confirm.isConfirmed) {
            setLoading(true);
            try {
                const res = await fetch('http://localhost/jcr/api/sales.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        product_id: product.id,
                        quantity: qty,
                        sold_by: currentUser.username
                    })
                });
                const data = await res.json();

                if (data.status === 'success') {
                    Swal.fire('¡Venta Exitosa!', '', 'success');
                    fetchProducts(); // Refresh list
                } else {
                    Swal.fire('Error', data.message, 'error');
                }
            } catch (e) {
                Swal.fire('Error', 'Error de conexión', 'error');
            } finally {
                setLoading(false);
            }
        }
    };

    // --- Renders ---

    const renderPOS = () => {
        const filtered = products.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
            <div style={{ padding: '2rem' }}>
                <div className="flex items-center gap-4 mb-6">
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 auto 0 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ShoppingCart className="text-primary" size={32} /> Punto de Venta
                    </h2>

                    <div className="relative">
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar producto..."
                            className="form-control"
                            style={{ paddingLeft: '2.5rem', minWidth: '300px' }}
                        />
                        <Search className="absolute left-3 top-3 text-muted" size={18} />
                    </div>

                    <button
                        onClick={() => setView('history')}
                        className="btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Archive size={18} /> Ver Historial
                    </button>
                </div>

                <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    {filtered.map(p => (
                        <div key={p.id} className="stat-card hover-scale" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '220px' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                    <span className="badge badge-active">{p.category}</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Stock: {p.quantity}</span>
                                </div>
                                <h3 className="text-xl font-bold mb-1" style={{ wordBreak: 'break-word' }}>{p.name}</h3>
                                <p className="text-muted text-sm mb-4">{p.brand}</p>
                            </div>

                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981', marginBottom: '1rem' }}>
                                    $ {parseInt(p.sale_price).toLocaleString()}
                                </div>
                                <button
                                    onClick={() => handleSell(p)}
                                    className="btn-primary w-full"
                                    style={{ fontSize: '1.1rem', padding: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                >
                                    <DollarSign size={20} /> VENDER
                                </button>
                            </div>
                        </div>
                    ))}
                    {filtered.length === 0 && !loading && (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                            <Package size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                            <p>No hay productos disponibles para venta.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderHistory = () => (
        <div style={{ padding: '2rem' }}>
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => setView('pos')} className="btn-back"><Plus size={24} style={{ transform: 'rotate(45deg)' }} /></button>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Historial de Ventas</h2>
            </div>

            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Producto</th>
                            <th>Vendedor</th>
                            <th>Cantidad</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salesHistory.map(s => (
                            <tr key={s.id}>
                                <td style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}><Calendar size={14} className="inline mr-2" />{new Date(s.sale_date).toLocaleString()}</td>
                                <td style={{ fontWeight: '500' }}>
                                    {s.product_name} <br />
                                    <span style={{ fontSize: '0.8rem', color: '#6366f1' }}>{s.sku}</span>
                                </td>
                                <td><User size={14} className="inline mr-2" />{s.sold_by}</td>
                                <td style={{ fontWeight: 'bold' }}>{s.quantity}</td>
                                <td style={{ color: '#10b981', fontWeight: 'bold' }}>$ {parseInt(s.total_price).toLocaleString()}</td>
                            </tr>
                        ))}
                        {salesHistory.length === 0 && !loading && (
                            <tr><td colSpan="5" className="text-center p-8">No hay ventas registradas.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div style={{ height: '100%', background: 'var(--bg-color)', overflowY: 'auto' }}>
            {view === 'pos' ? renderPOS() : renderHistory()}
        </div>
    );
}

export default SalesPage;
