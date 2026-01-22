import { useState } from 'react';
import { Menu, TrendingUp, Users, DollarSign, Activity } from 'lucide-react';
import Sidebar from './Sidebar';
import UsersPage from './UsersPage';
import SettingsPage from './SettingsPage';

function Dashboard({ user, onLogout }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeView, setActiveView] = useState('dashboard');

    const renderContent = () => {
        switch (activeView) {
            case 'users':
                return <UsersPage currentUser={user} />;
            case 'settings':
                return <SettingsPage currentUser={user} />;
            case 'dashboard':
            default:
                return (
                    <div className="pt-4 md:pt-0">
                        <h1 className="text-2xl font-bold mb-6 text-white">Resumen del Panel</h1>

                        <div className="dashboard-grid">
                            <div className="stat-card">
                                <div className="stat-header">
                                    <div>
                                        <div className="stat-label">Usuarios Totales</div>
                                        <div className="stat-value">1,234</div>
                                    </div>
                                    <div className="stat-icon">
                                        <Users size={24} />
                                    </div>
                                </div>
                                <div className="text-sm text-green-400 flex items-center gap-1">
                                    <TrendingUp size={16} />
                                    <span>+12.5% vs mes anterior</span>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-header">
                                    <div>
                                        <div className="stat-label">Ingresos Totales</div>
                                        <div className="stat-value">$45,231</div>
                                    </div>
                                    <div className="stat-icon" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)' }}>
                                        <DollarSign size={24} />
                                    </div>
                                </div>
                                <div className="text-sm text-green-400 flex items-center gap-1">
                                    <TrendingUp size={16} />
                                    <span>+4.3% vs semana anterior</span>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-header">
                                    <div>
                                        <div className="stat-label">Sesiones Activas</div>
                                        <div className="stat-value">432</div>
                                    </div>
                                    <div className="stat-icon" style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)' }}>
                                        <Activity size={24} />
                                    </div>
                                </div>
                                <div className="text-sm text-slate-400">
                                    Usuarios activos actualmente
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity or Chart Placeholder */}
                        <div className="mt-8">
                            <h2 className="text-xl font-semibold mb-4 text-white">Actividad Reciente</h2>
                            <div className="stat-card" style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <p className="text-muted">La visualización del gráfico iría aquí...</p>
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
