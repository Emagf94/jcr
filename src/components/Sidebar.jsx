import { useRef, useEffect } from 'react';
import {
    Home,
    Users,
    Settings,
    LogOut,
    X,
    PieChart,
    Box,
    CreditCard,
    Bike
} from 'lucide-react';

function Sidebar({ isOpen, onClose, user, onLogout, currentView, onNavigate }) {
    const sidebarRef = useRef(null);

    // Close sidebar when clicking outside on mobile
    useEffect(() => {
        function handleClickOutside(event) {
            if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                onClose();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    const handleNav = (view) => (e) => {
        e.preventDefault();
        onNavigate(view);
        if (window.innerWidth < 768) {
            onClose();
        }
    };

    return (
        <>
            <div
                className={`overlay ${isOpen ? 'active' : ''}`}
                onClick={onClose}
            />
            <aside
                ref={sidebarRef}
                className={`sidebar ${isOpen ? 'open' : ''}`}
            >
                <div className="logo-container">
                    <img src="/jcr.png" alt="Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                    <span className="logo-text">JCR Motos</span>
                    <button
                        className="menu-toggle ml-auto md:hidden"
                        onClick={onClose}
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="nav-links">
                    <a href="#" onClick={handleNav('dashboard')} className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}>
                        <Home size={20} />
                        <span>Inicio</span>
                    </a>
                    <a href="#" onClick={handleNav('motorcycles')} className={`nav-item ${currentView === 'motorcycles' ? 'active' : ''}`}>
                        <Bike size={20} />
                        <span>Motos</span>
                    </a>
                    <a href="#" onClick={handleNav('reports')} className={`nav-item ${currentView === 'reports' ? 'active' : ''}`}>
                        <PieChart size={20} />
                        <span>Reportes</span>
                    </a>
                    <a href="#" onClick={handleNav('sales')} className={`nav-item ${currentView === 'sales' ? 'active' : ''}`}>
                        <CreditCard size={20} />
                        <span>Ventas</span>
                    </a>

                    {/* Inventory - Only for Owner/Developer */}
                    {(user.role === 'owner' || user.role === 'developer') && (
                        <a href="#" onClick={handleNav('inventory')} className={`nav-item ${currentView === 'inventory' ? 'active' : ''}`}>
                            <Box size={20} />
                            <span>Inventario</span>
                        </a>
                    )}

                    <a href="#" onClick={handleNav('users')} className={`nav-item ${currentView === 'users' ? 'active' : ''}`}>
                        <Users size={20} />
                        <span>Usuarios</span>
                    </a>

                    <div style={{ flex: 1 }}></div>
                    <a href="#" onClick={handleNav('settings')} className={`nav-item ${currentView === 'settings' ? 'active' : ''}`}>
                        <Settings size={20} />
                        <span>Configuración</span>
                    </a>
                </nav>

                <div className="user-profile">
                    <div className="user-avatar">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-info">
                        <div className="user-name">{user.full_name}</div>
                        <div className="user-role">
                            {user.role === 'developer' ? 'Desarrollador' :
                                user.role === 'owner' ? 'Dueño' :
                                    user.role === 'mechanic' ? 'Mecánico' : user.role}
                        </div>
                    </div>
                    <button
                        onClick={onLogout}
                        className="text-slate-400 hover:text-red-400 transition-colors"
                        title="Cerrar Sesión"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;
