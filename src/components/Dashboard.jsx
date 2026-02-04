import { useState } from 'react';
import { Menu, TrendingUp, Users, DollarSign, Activity, Bike, ShoppingCart, Box, PieChart, Settings, LogOut } from 'lucide-react';
import Sidebar from './Sidebar';
import UsersPage from './UsersPage';
import SettingsPage from './SettingsPage';
import MotorcyclesPage from './MotorcyclesPage';
import InventoryPage from './InventoryPage';
import SalesPage from './SalesPage';
import ReportsPage from './ReportsPage';

function Dashboard({ user, onLogout }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeView, setActiveView] = useState('dashboard');

    const renderContent = () => {
        switch (activeView) {
            case 'users':
                return <UsersPage currentUser={user} />;
            case 'settings':
                return <SettingsPage currentUser={user} />;
            case 'inventory':
                return <InventoryPage currentUser={user} />;
            case 'sales':
                return <SalesPage currentUser={user} />;
            case 'reports':
                return <ReportsPage currentUser={user} />;
            case 'motorcycles':
                return <MotorcyclesPage currentUser={user} />;
            case 'dashboard':
            default:
                return (

                    <div className="pt-4 md:pt-0" style={{ height: '100%', overflowY: 'auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <h1 className="text-3xl font-bold text-white mb-2">Bienvenido, {user.full_name.split(' ')[0]}</h1>
                            <p className="text-muted">Selecciona un módulo para comenzar</p>
                        </div>

                        <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', paddingBottom: '2rem' }}>

                            {/* Motorcycles Module */}
                            <div onClick={() => setActiveView('motorcycles')}
                                className="stat-card hover-scale"
                                style={{ cursor: 'pointer', textAlign: 'center', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '250px' }}>
                                <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem', color: '#818cf8' }}>
                                    <Bike size={48} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Gestión de Motos</h3>
                                <p className="text-muted text-sm">Registrar vehículos, consultar historial y mantenimientos.</p>
                            </div>

                            {/* Sales Module */}
                            <div onClick={() => setActiveView('sales')}
                                className="stat-card hover-scale"
                                style={{ cursor: 'pointer', textAlign: 'center', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '250px' }}>
                                <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem', color: '#10b981' }}>
                                    <ShoppingCart size={48} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Punto de Venta</h3>
                                <p className="text-muted text-sm">Vender repuestos, aceites y controlar caja.</p>
                            </div>

                            {/* Inventory Module (Owner/Dev Only) */}
                            {(user.role === 'owner' || user.role === 'developer') && (
                                <div onClick={() => setActiveView('inventory')}
                                    className="stat-card hover-scale"
                                    style={{ cursor: 'pointer', textAlign: 'center', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '250px' }}>
                                    <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem', color: '#38bdf8' }}>
                                        <Box size={48} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Inventario</h3>
                                    <p className="text-muted text-sm">Gestionar stock, precios y proveedores.</p>
                                </div>
                            )}

                            {/* Reports Module */}
                            <div onClick={() => setActiveView('reports')}
                                className="stat-card hover-scale"
                                style={{ cursor: 'pointer', textAlign: 'center', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '250px' }}>
                                <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem', color: '#f59e0b' }}>
                                    <PieChart size={48} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Reportes</h3>
                                <p className="text-muted text-sm">Métricas de rendimiento, ingresos y productividad.</p>
                            </div>

                            {/* Users Module */}
                            <div onClick={() => setActiveView('users')}
                                className="stat-card hover-scale"
                                style={{ cursor: 'pointer', textAlign: 'center', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '250px' }}>
                                <div style={{ background: 'rgba(236, 72, 153, 0.1)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem', color: '#ec4899' }}>
                                    <Users size={48} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Usuarios</h3>
                                <p className="text-muted text-sm">Gestión de personal y accesos.</p>
                            </div>

                            {/* Settings Module */}
                            <div onClick={() => setActiveView('settings')}
                                className="stat-card hover-scale"
                                style={{ cursor: 'pointer', textAlign: 'center', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '250px' }}>
                                <div style={{ background: 'rgba(148, 163, 184, 0.1)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem', color: '#94a3b8' }}>
                                    <Settings size={48} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Configuración</h3>
                                <p className="text-muted text-sm">Opciones del sistema y cuenta.</p>
                            </div>

                            {/* Logout Action */}
                            <div onClick={onLogout}
                                className="stat-card hover-scale"
                                style={{ cursor: 'pointer', textAlign: 'center', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '250px', border: '1px solid #ef4444' }}>
                                <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem', color: '#ef4444' }}>
                                    <LogOut size={48} />
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-red-400">Cerrar Sesión</h3>
                                <p className="text-muted text-sm">Salir de la aplicación de forma segura.</p>
                            </div>

                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                user={user}
                onLogout={onLogout}
                currentView={activeView}
                onNavigate={setActiveView}
            />

            <main className="main-content">
                <header className="header-mobile">
                    <div className="flex items-center gap-3">
                        <img src="/jcr.png" alt="Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                        <span className="logo-text text-xl">JCR Motos</span>
                    </div>
                    <button
                        className="menu-toggle"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu size={24} />
                    </button>
                </header>

                {renderContent()}
            </main>
        </div>
    );
}

export default Dashboard;
