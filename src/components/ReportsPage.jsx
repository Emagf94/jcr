import { useState, useMemo, useEffect } from 'react';
import {
    PieChart as IconPieChart, Calendar, Printer, User, DollarSign,
    TrendingUp, FileText, Search, Activity, Wrench
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { API_URL } from '../config';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

function ReportsPage({ currentUser }) {
    // Default to current month
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    const [startDate, setStartDate] = useState(firstDay.toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(today.toISOString().split('T')[0]);
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchReport();
    }, []);

    const fetchReport = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/reports.php?start=${startDate}&end=${endDate}`);
            const data = await res.json();
            if (data.status === 'success') {
                setReportData(data);
                // Removed auto-alert to avoid popups on load
            } else {
                Swal.fire('Error', 'Error al cargar reporte', 'error');
            }
        } catch (e) {
            console.error(e);
            Swal.fire('Error', 'Error de conexión', 'error');
        } finally {
            setLoading(false);
        }
    };

    // --- Analytics Processors ---
    const chartData = useMemo(() => {
        if (!reportData) return { timeline: [], services: [], stats: [] };

        // 1. Timeline (Revenue per Day)
        const timelineMap = {};
        reportData.details.forEach(d => {
            const date = d.service_date.split(' ')[0]; // YYYY-MM-DD
            timelineMap[date] = (timelineMap[date] || 0) + parseInt(d.cost || 0);
        });
        const timeline = Object.keys(timelineMap).map(date => ({ date, total: timelineMap[date] })).sort((a, b) => new Date(a.date) - new Date(b.date));

        // 2. Service Types Distribution
        const serviceMap = {};
        reportData.details.forEach(d => {
            serviceMap[d.service_type] = (serviceMap[d.service_type] || 0) + 1;
        });
        const services = Object.keys(serviceMap).map(name => ({ name, value: serviceMap[name] }));

        // 3. Stats (Ensure numbers for Recharts)
        const stats = reportData.stats.map(s => ({
            mechanic_name: s.mechanic_name,
            total_revenue: parseFloat(s.total_revenue || 0),
            jobs_count: parseInt(s.jobs_count || 0)
        }));

        return { timeline, services, stats };
    }, [reportData]);

    const KPIs = useMemo(() => {
        if (!reportData) return { revenue: 0, jobs: 0, avgTicket: 0, topMech: '-' };
        const revenue = reportData.details.reduce((acc, curr) => acc + parseInt(curr.cost || 0), 0);
        const jobs = reportData.details.length;
        const avgTicket = jobs > 0 ? Math.round(revenue / jobs) : 0;
        const topMech = reportData.stats.length > 0 ? reportData.stats[0].mechanic_name : '-';
        return { revenue, jobs, avgTicket, topMech };
    }, [reportData]);


    const downloadPDF = () => {
        if (!reportData) return;
        const doc = new jsPDF();

        doc.setFillColor(41, 128, 185);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setFontSize(22);
        doc.setTextColor(255, 255, 255);
        doc.text('Reporte General de Rendimiento', 105, 15, { align: 'center' });
        doc.setFontSize(12);
        doc.text(`Rango: ${startDate} a ${endDate}`, 105, 25, { align: 'center' });
        doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 105, 32, { align: 'center' });

        let currentY = 50;

        // KPIs in PDF
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.text(`Total Ingresos: $${KPIs.revenue.toLocaleString()}`, 15, currentY);
        doc.text(`Total Servicios: ${KPIs.jobs}`, 80, currentY);
        doc.text(`Ticket Promedio: $${KPIs.avgTicket.toLocaleString()}`, 140, currentY);
        currentY += 10;

        // Mechanic Table
        doc.setFontSize(14);
        doc.text('Rendimiento por Técnico', 14, currentY);
        currentY += 5;
        const statsBody = reportData.stats.map(s => [s.mechanic_name, s.jobs_count, `$ ${parseInt(s.total_revenue).toLocaleString()}`]);
        autoTable(doc, {
            startY: currentY,
            head: [['Técnico', 'Servicios', 'Total Generado']],
            body: statsBody,
            theme: 'striped',
            headStyles: { fillColor: [52, 152, 219] }
        });
        currentY = doc.lastAutoTable.finalY + 15;

        // Detailed Table
        doc.text('Detalle de Servicios', 14, currentY);
        currentY += 5;
        const detailsBody = reportData.details.map(d => [
            d.service_date,
            d.mechanic_name,
            d.service_type,
            d.description.length > 30 ? d.description.substring(0, 30) + '...' : d.description,
            `$ ${parseInt(d.cost).toLocaleString()}`
        ]);
        autoTable(doc, {
            startY: currentY,
            head: [['Fecha', 'Mecánico', 'Tipo', 'Descripción', 'Costo']],
            body: detailsBody,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [46, 204, 113] }
        });

        doc.save(`Reporte_JCR_${startDate}_${endDate}.pdf`);
    };

    return (
        <div style={{ padding: '2rem', height: '100%', overflowY: 'auto', background: 'var(--bg-color)' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', color: '#fff' }}>
                <Activity className="text-primary" size={40} /> Tablero de Análisis
            </h2>

            {/* Filters */}
            <div className="login-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-end' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>Fecha Inicio</label>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="form-control" />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>Fecha Fin</label>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="form-control" />
                    </div>
                    <button onClick={fetchReport} disabled={loading} className="btn-primary" style={{ height: '42px', marginBottom: '2px' }}>
                        <Search size={18} className="inline mr-2" /> Analizar
                    </button>
                    {reportData && (
                        <button onClick={downloadPDF} className="btn-secondary" style={{ height: '42px', marginBottom: '2px', background: '#ef4444', color: 'white', border: 'none' }}>
                            <Printer size={18} className="inline mr-2" /> PDF
                        </button>
                    )}
                </div>
            </div>

            {reportData && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* KPI Cards */}
                    <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div className="stat-card">
                            <div className="stat-label">Ingresos Totales</div>
                            <div className="stat-value text-green-400">$ {KPIs.revenue.toLocaleString()}</div>
                            <div className="stat-icon"><DollarSign /></div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Servicios Realizados</div>
                            <div className="stat-value text-blue-400">{KPIs.jobs}</div>
                            <div className="stat-icon"><Wrench /></div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Ticket Promedio</div>
                            <div className="stat-value text-yellow-400">$ {KPIs.avgTicket.toLocaleString()}</div>
                            <div className="stat-icon"><TrendingUp /></div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Mejor Técnico</div>
                            <div className="stat-value text-purple-400" style={{ fontSize: '1.2rem' }}>{KPIs.topMech}</div>
                            <div className="stat-icon"><User /></div>
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>

                        {/* Revenue Line Chart */}
                        <div className="stat-card" style={{ height: '350px' }}>
                            <h3 className="text-lg font-bold mb-4">Ingresos por Día</h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData.timeline}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                    <XAxis dataKey="date" stroke="#999" />
                                    <YAxis stroke="#999" />
                                    <Tooltip contentStyle={{ background: '#1e293b', border: 'none' }} />
                                    <Legend />
                                    <Line type="monotone" dataKey="total" stroke="#10b981" activeDot={{ r: 8 }} name="Ingresos ($)" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Mechanic Bar Chart */}
                        <div className="stat-card" style={{ height: '350px' }}>
                            <h3 className="text-lg font-bold mb-4">Ingresos por Técnico</h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData.stats}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                    <XAxis dataKey="mechanic_name" stroke="#999" />
                                    <YAxis stroke="#999" />
                                    <Tooltip contentStyle={{ background: '#1e293b', border: 'none' }} />
                                    <Legend />
                                    <Bar dataKey="total_revenue" fill="#8884d8" name="Total ($)" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Service Types Pie Chart */}
                        <div className="stat-card" style={{ height: '350px' }}>
                            <h3 className="text-lg font-bold mb-4">Distribución de Servicios</h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData.services}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {chartData.services.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ background: '#1e293b', border: 'none' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Detailed Data Table */}
                    <div className="stat-card">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <FileText size={20} /> Detalle de Registros
                        </h3>
                        <div className="users-table-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Mecánico</th>
                                        <th>Servicio</th>
                                        <th>Costo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.details.map((row, i) => (
                                        <tr key={i}>
                                            <td>{row.service_date}</td>
                                            <td>{row.mechanic_name}</td>
                                            <td>
                                                <div className="font-bold">{row.service_type}</div>
                                                <div className="text-xs text-muted truncate max-w-[200px]">{row.description}</div>
                                            </td>
                                            <td style={{ color: '#10b981' }}>$ {parseInt(row.cost).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}

export default ReportsPage;
