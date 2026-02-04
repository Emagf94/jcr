import { useState, useEffect } from 'react';
import { Bike, Search, Plus, ArrowLeft, Save, FileText, User, Wrench, Clock, History, PenTool, ClipboardList, Printer, MessageCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './MotorcyclesPage.css';

// Datos de Motos para Selectores Dinámicos
const MOTO_DATA = {
    Yamaha: {
        Scooter: ['NMAX Connected', 'NMAX 155', 'BWS FI', 'BWS X', 'Aerox 155', 'Crypton FI'],
        Sport: ['R15 V3', 'R15 V4', 'R3', 'MT-15', 'MT-03', 'MT-07', 'MT-09', 'FZ 25', 'FZ-S 3.0', 'FZN 150', 'Sz RR'],
        Enduro: ['XTZ 125', 'XTZ 150', 'XTZ 250', 'WR 155'],
        Calle: ['YBR 125', 'Libero 125'],
        Moped: ['Crypton']
    },
    Honda: {
        Scooter: ['PCX 150', 'PCX 160', 'Dio', 'Navi', 'Elite 125'],
        Sport: ['CBR 250RR', 'CBR 650R', 'CB 650R', 'CB 500F', 'CB 300F', 'CB 190R'],
        Calle: ['CB 125F', 'CB 160F', 'Invicta', 'Splendor', 'Eco Deluxe', 'Twister 250'],
        Enduro: ['XR 150L', 'XR 190L', 'XRE 300', 'XRE 190'],
        Adventure: ['Africa Twin', 'NC 750X', 'X-ADV']
    },
    Suzuki: {
        Scooter: ['Burgman 125', 'Access 125', 'Address 115'],
        Calle: ['GN 125', 'GS 125', 'Gixxer 150', 'Gixxer 250', 'Gixxer SF 250', 'AX 4'],
        Sport: ['GSX-R150', 'GSX-S150', 'GSX-S750', 'V-Strom 250'],
        Enduro: ['DR 150', 'DR 200', 'DR 650']
    },
    AKT: {
        Scooter: ['Dynamic Pro', 'Dynamic K', 'Jet 125', 'Special 110'],
        Calle: ['NKD 125', 'CR4 125', 'CR4 162', 'Flex 125', 'Flex LED'],
        Sport: ['CR5 180', 'CR5 200'],
        Enduro: ['TTR 125', 'TTR 200', 'TT Dual Sport'],
        Adventure: ['TTR 250 Adventour']
    },
    Hero: {
        Calle: ['Eco Deluxe', 'Splendor iSmart', 'Ignitor 125', 'Thriller 200R'],
        Scooter: ['Dash 125'],
        Enduro: ['Xpulse 200', 'Xpulse 200T']
    },
    KTM: {
        Sport: ['Duke 200', 'Duke 250', 'Duke 390', 'RC 200', 'RC 390'],
        Enduro: ['EXC 250', 'EXC 300', 'EXC-F 350'],
        Adventure: ['Adventure 250', 'Adventure 390']
    },
    Auteco: { // Incluyendo Victory / Kymco / Kawasaki
        Scooter: ['Victory Black', 'Victory Life', 'Kymco Twist', 'Kymco Agility', 'Kymco Urban'],
        Calle: ['Victory One', 'Victory Bomber', 'Benelli 180S'],
        Sport: ['Kawasaki Z400', 'Kawasaki Ninja 400', 'Victory Venom 400'],
        Enduro: ['Victory MRX 125', 'Victory MRX 150']
    },
    SYM: {
        Scooter: ['Crox 125', 'Crox 150', 'Crox R', 'Citycom 300i', 'Orbit II'],
        Calle: ['NH X 190', 'Wolf 125']
    }
};

const BRANDS = Object.keys(MOTO_DATA);
BRANDS.push('Otra');

const WhatsAppIcon = ({ size = 24, color = "#25D366" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
);

function MotorcyclesPage({ currentUser }) {
    const [view, setView] = useState('home'); // home, register, search, profile
    const [searchTerm, setSearchTerm] = useState('');
    const [motorcycles, setMotorcycles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedMoto, setSelectedMoto] = useState(null);
    const [activeTab, setActiveTab] = useState('maintenance'); // maintenance, history
    const [maintenanceRecords, setMaintenanceRecords] = useState([]);

    // Form State with support for custom fields for "Otra" option
    const [formData, setFormData] = useState({
        owner_name: '',
        owner_id: '',
        owner_address: '',
        owner_email: '',
        owner_phone: '',
        owner_mobile: '',
        brand: '',
        type: '',
        license_plate: '',
        model: '',
        custom_brand: '',
        custom_type: '',
        custom_model: '',
        soat_expiry: '',
        technomechanical_expiry: ''
    });

    // Maintenance Form State
    // Maintenance State
    const [servicesList, setServicesList] = useState([]);
    const [currentService, setCurrentService] = useState({
        service_type: '',
        description: '',
        cost: ''
    });

    const [maintenanceMeta, setMaintenanceMeta] = useState({
        mileage: '',
        mechanic_notes: ''
    });

    const [photos, setPhotos] = useState([]);

    // Helpers for dependent dropdowns
    const getTypes = () => {
        if (!formData.brand || formData.brand === 'Otra' || !MOTO_DATA[formData.brand]) {
            return ['Scooter', 'Sport', 'Calle', 'Enduro', 'Moped', 'Adventure', 'Otra'];
        }
        return [...Object.keys(MOTO_DATA[formData.brand]), 'Otra'];
    };

    const getModels = () => {
        if (!formData.brand || !formData.type ||
            formData.brand === 'Otra' || formData.type === 'Otra' ||
            !MOTO_DATA[formData.brand] || !MOTO_DATA[formData.brand][formData.type]) {
            return [];
        }
        return [...MOTO_DATA[formData.brand][formData.type], 'Otra'];
    };

    const fetchMotorcycles = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost/jcr/api/motorcycles.php?search=${searchTerm}`);
            const data = await res.json();
            if (data.status === 'success') {
                setMotorcycles(data.data);
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudieron cargar las motos', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchMaintenanceHistory = async (motoId) => {
        try {
            const res = await fetch(`http://localhost/jcr/api/maintenance.php?moto_id=${motoId}`);
            const data = await res.json();
            if (data.status === 'success') {
                setMaintenanceRecords(data.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (view === 'search') {
            fetchMotorcycles();
        }
        if (view === 'profile' && selectedMoto) {
            fetchMaintenanceHistory(selectedMoto.id);
        }
    }, [view, searchTerm, selectedMoto]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Reset logic for dependent fields
        if (name === 'brand') {
            setFormData(prev => ({
                ...prev,
                brand: value,
                type: '',
                model: '',
                custom_brand: value === 'Otra' ? '' : prev.custom_brand,
                custom_type: '',
                custom_model: ''
            }));
            return;
        }

        if (name === 'type') {
            setFormData(prev => ({
                ...prev,
                type: value,
                model: '',
                custom_type: value === 'Otra' ? '' : prev.custom_type,
                custom_model: ''
            }));
            return;
        }

        if (name === 'model') {
            setFormData(prev => ({
                ...prev,
                model: value,
                custom_model: value === 'Otra' ? '' : prev.custom_model
            }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Resolve final values (dropdown vs custom input)
        const finalData = {
            ...formData,
            brand: formData.brand === 'Otra' ? formData.custom_brand : formData.brand,
            type: formData.type === 'Otra' ? formData.custom_type : formData.type,
            model: formData.model === 'Otra' ? formData.custom_model : formData.model
        };

        if (!finalData.brand || !finalData.type || !finalData.model) {
            setLoading(false);
            Swal.fire('Atención', 'Por favor completa Marca, Tipo y Modelo', 'warning');
            return;
        }

        try {
            const res = await fetch('http://localhost/jcr/api/motorcycles.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData)
            });
            const data = await res.json();

            if (data.status === 'success') {
                Swal.fire('Éxito', 'Moto registrada correctamente', 'success');
                setFormData({
                    owner_name: '',
                    owner_id: '',
                    owner_address: '',
                    owner_email: '',
                    owner_phone: '',
                    owner_mobile: '',
                    brand: '',
                    type: '',
                    license_plate: '',
                    model: '',
                    custom_brand: '',
                    custom_type: '',
                    custom_model: '',
                    soat_expiry: '',
                    technomechanical_expiry: ''
                });
                setView('home');
            } else {
                Swal.fire('Error', data.message || 'Error al registrar', 'error');
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Error de conexión', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleServiceInput = (e) => {
        const { name, value } = e.target;
        setCurrentService(prev => ({ ...prev, [name]: value }));
    };

    const handleMetaInput = (e) => {
        const { name, value } = e.target;
        setMaintenanceMeta(prev => ({ ...prev, [name]: value }));
    };

    const addService = () => {
        if (!currentService.service_type || !currentService.description) {
            Swal.fire('Atención', 'Selecciona servicio y añade descripción', 'warning');
            return;
        }
        setServicesList([...servicesList, currentService]);
        setCurrentService({ service_type: '', description: '', cost: '' });
    };

    const removeService = (index) => {
        setServicesList(prev => prev.filter((_, i) => i !== index));
    };

    const calculateTotal = () => {
        return servicesList.reduce((acc, curr) => acc + (parseInt(curr.cost) || 0), 0);
    };

    const generatePDF = async (record) => {
        try {
            const doc = new jsPDF();

            // Header
            doc.setFillColor(41, 128, 185);
            doc.rect(0, 0, 210, 40, 'F');

            // Try logo
            try {
                const img = new Image();
                img.src = '/jcr.png';
                await new Promise(r => { img.onload = r; img.onerror = r; });
                doc.addImage(img, 'PNG', 10, 5, 30, 30);
            } catch (e) { }

            doc.setFontSize(26);
            doc.setTextColor(255, 255, 255);
            doc.text('JCR Motos', 50, 25);
            doc.setFontSize(10);
            doc.text('Taller Especializado', 50, 32);

            doc.setFontSize(12);
            doc.text('REPORTE DE SERVICIO', 140, 25);
            doc.text(`Fecha: ${new Date(record.service_date).toLocaleDateString()}`, 140, 32);

            let currentY = 55;

            // Vehicle Info
            doc.setFontSize(14);
            doc.setTextColor(41, 128, 185);
            doc.text('Información del Vehículo', 15, currentY);

            const vehicleInfo = [
                ['Propietario', selectedMoto.owner_name || 'N/A'],
                ['Placa', selectedMoto.license_plate || 'N/A'],
                ['Marca', selectedMoto.brand || 'N/A'],
                ['Modelo', selectedMoto.model || 'N/A']
            ];

            autoTable(doc, {
                startY: currentY + 5,
                body: vehicleInfo,
                theme: 'grid',
                showHead: 'never',
                styles: { fontSize: 11, cellPadding: 3 },
                columnStyles: { 0: { fontStyle: 'bold', width: 40, fillColor: [240, 240, 240] } }
            });

            currentY = doc.lastAutoTable.finalY + 15;

            // Service Details
            doc.setFontSize(14);
            doc.setTextColor(41, 128, 185);
            doc.text('Detalles del Mantenimiento', 15, currentY);

            let tableBody = [];
            let isMultiService = false;

            try {
                const parsed = JSON.parse(record.description);
                if (Array.isArray(parsed)) {
                    isMultiService = true;
                    parsed.forEach(item => {
                        tableBody.push([
                            item.service_type,
                            item.description,
                            record.mileage ? `${record.mileage} km` : '-',
                            `$ ${parseInt(item.cost || 0).toLocaleString()}`
                        ]);
                    });
                } else {
                    throw new Error("Not array");
                }
            } catch (e) {
                // Fallback for distinct string records
                tableBody.push([
                    record.service_type || '-',
                    record.description || '-',
                    record.mileage ? `${record.mileage} km` : '-',
                    `$ ${parseInt(record.cost || 0).toLocaleString()}`
                ]);
            }

            autoTable(doc, {
                startY: currentY + 5,
                head: [['Servicio', 'Descripción', 'Kilometraje', 'Costo']],
                body: tableBody,
                theme: 'striped',
                headStyles: { fillColor: [41, 128, 185], fontSize: 11 },
                bodyStyles: { fontSize: 10, cellPadding: 3 }
            });

            // Total Cost row if multi-service
            if (isMultiService) {
                autoTable(doc, {
                    startY: doc.lastAutoTable.finalY,
                    body: [['', '', 'TOTAL:', `$ ${parseInt(record.cost || 0).toLocaleString()}`]],
                    theme: 'plain',
                    styles: { fontSize: 11, fontStyle: 'bold', cellPadding: 3 },
                    columnStyles: { 0: { width: 40 }, 1: { width: 60 } }
                });
            }

            currentY = doc.lastAutoTable.finalY + 15;

            // Photos Grid (4 per page -> ~90x90 boxes)
            if (record.photos && record.photos.length > 0) {
                doc.addPage();
                currentY = 20;
                doc.setFontSize(14);
                doc.setTextColor(41, 128, 185);
                doc.text('Evidencia Fotográfica', 15, currentY);
                currentY += 10;

                for (let i = 0; i < record.photos.length; i++) {
                    // 4 pics per page logic
                    if (i > 0 && i % 4 === 0) {
                        doc.addPage();
                        currentY = 30; // Margin top
                    }

                    const col = i % 2;
                    const row = Math.floor((i % 4) / 2);

                    const boxW = 85;
                    const boxH = 80;
                    const marginX = 10;
                    const startX = 15;

                    const xPos = startX + (col * (boxW + marginX));
                    const yPos = currentY + (row * (boxH + 10));

                    try {
                        const photoUrl = `http://localhost/jcr/api/get_image.php?file=${encodeURIComponent(record.photos[i])}`;

                        // 1. Fetch Blob
                        const res = await fetch(photoUrl);
                        if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`);
                        const blob = await res.blob();

                        // 2. Load into Image via ObjectURL
                        const img = await new Promise((resolve, reject) => {
                            const i = new Image();
                            i.onload = () => resolve(i);
                            i.onerror = reject;
                            i.src = URL.createObjectURL(blob);
                        });

                        // 3. Resize with Canvas (Prevent Huge PDF / Memory Issues)
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        const maxDim = 800;
                        let w = img.width;
                        let h = img.height;

                        if (w > maxDim || h > maxDim) {
                            const ratio = Math.min(maxDim / w, maxDim / h);
                            w *= ratio;
                            h *= ratio;
                        }
                        canvas.width = w;
                        canvas.height = h;
                        ctx.drawImage(img, 0, 0, w, h);

                        // 4. Get Compressed Base64
                        const compressedData = canvas.toDataURL('image/jpeg', 0.8);

                        // Clean up
                        URL.revokeObjectURL(img.src);

                        // 5. PDF Layout Calculation
                        const scale = Math.min(boxW / w, boxH / h);
                        const destW = w * scale;
                        const destH = h * scale;

                        // Center in Box
                        const finalX = xPos + (boxW - destW) / 2;
                        const finalY = yPos + (boxH - destH) / 2;

                        doc.addImage(compressedData, 'JPEG', finalX, finalY, destW, destH);
                        doc.setDrawColor(200);
                        doc.rect(xPos, yPos, boxW, boxH);


                    } catch (err) {
                        console.warn("Error embedding photo:", err);
                        doc.setFontSize(10);
                        doc.setTextColor(255, 0, 0);
                        doc.text('[Error Img]', xPos + 10, yPos + 10);
                        doc.setDrawColor(200);
                        doc.rect(xPos, yPos, boxW, boxH);
                    }
                }
            }

            doc.save(`JCR_Reporte_${selectedMoto.license_plate}.pdf`);

        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'PDF Error: ' + error.message, 'error');
        }
    };

    const sendWhatsApp = (record) => {
        const phone = selectedMoto.owner_mobile;
        if (!phone) {
            Swal.fire('Error', 'El propietario no tiene número de celular registrado', 'error');
            return;
        }

        const mechanic = record.mechanic_name || 'nuestro equipo';
        let msgBody = ``;

        try {
            const parsed = JSON.parse(record.description);
            if (Array.isArray(parsed)) {
                // Multi-service
                parsed.forEach(s => {
                    msgBody += `🔧 *${s.service_type}*: ${s.description}\n`;
                });
            } else {
                msgBody = `🔧 *${record.service_type}*: ${record.description}`;
            }
        } catch (e) {
            msgBody = `🔧 *${record.service_type}*: ${record.description}`;
        }

        const message = `Hola ${selectedMoto.owner_name}, te saludamos de *JCR Motos*.\n\nTu vehículo: *${selectedMoto.brand} ${selectedMoto.model}*\nPlaca: *${selectedMoto.license_plate}*\nAtendido por: *${mechanic}*\n\n${msgBody}\n\n⚠️ Total: $${parseInt(record.cost).toLocaleString()}\n\nTu moto ya se encuentra lista. ¡Te esperamos!`;

        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const handleMaintenanceSubmit = async (e) => {
        e.preventDefault();
        if (servicesList.length === 0) {
            Swal.fire('Error', 'Debes agregar al menos un servicio a la lista.', 'warning');
            return;
        }
        setLoading(true);

        const formDataPayload = new FormData();

        // Construct composite data
        const compositeDesc = JSON.stringify(servicesList);
        const totalCost = servicesList.reduce((acc, curr) => acc + (parseInt(curr.cost) || 0), 0);

        formDataPayload.append('service_type', "Servicios Múltiples");
        formDataPayload.append('description', compositeDesc);
        formDataPayload.append('mileage', maintenanceMeta.mileage);
        formDataPayload.append('cost', totalCost);
        formDataPayload.append('mechanic_notes', maintenanceMeta.mechanic_notes);

        formDataPayload.append('motorcycle_id', selectedMoto.id);
        formDataPayload.append('mechanic_name', currentUser?.name || currentUser?.username || 'Mecánico');

        // Append photos
        Array.from(photos).forEach(file => {
            formDataPayload.append('photos[]', file);
        });

        try {
            const res = await fetch('http://localhost/jcr/api/maintenance.php', {
                method: 'POST',
                // No Content-Type header needed for FormData; browser sets it with boundary
                body: formDataPayload
            });
            const data = await res.json();

            if (data.status === 'success') {
                Swal.fire('Éxito', 'Mantenimiento registrado', 'success');
                setServicesList([]);
                setCurrentService({ service_type: '', description: '', cost: '' });
                setMaintenanceMeta({ mileage: '', mechanic_notes: '' });
                setPhotos([]);
                fetchMaintenanceHistory(selectedMoto.id);
                setActiveTab('history');
            } else {
                Swal.fire('Error', data.message || 'Error al registrar', 'error');
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Error de conexión', 'error');
        } finally {
            setLoading(false);
        }
    };

    const renderHome = () => (
        <div className="motos-container">
            <div className="motos-header">
                <h2 className="motos-title">
                    Gestión de Taller
                </h2>
                <p className="motos-subtitle">Selecciona una operación para comenzar</p>
            </div>

            <div className="options-grid">
                <div
                    onClick={() => setView('register')}
                    className="option-card"
                >
                    <div className="icon-wrapper">
                        <Plus size={32} />
                    </div>

                    <h3 className="card-title">Registrar Moto</h3>
                    <p className="card-description">
                        Ingresa un nuevo vehículo al sistema. Registra datos del propietario y especificaciones técnicas de manera rápida.
                    </p>

                    <div className="card-action">
                        Comenzar Registro <span>→</span>
                    </div>
                </div>

                <div
                    onClick={() => setView('search')}
                    className="option-card search-card"
                >
                    <div className="icon-wrapper">
                        <Search size={32} />
                    </div>

                    <h3 className="card-title">Buscar Moto</h3>
                    <p className="card-description">
                        Consulta el perfil completo, historial de mantenimientos y datos del propietario.
                    </p>

                    <div className="card-action" style={{ color: '#10b981' }}>
                        Realizar Búsqueda <span>→</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderRegister = () => (
        <div className="max-w-4xl mx-auto p-4 pb-20">
            <div className="flex items-center gap-4 mb-6" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button onClick={() => setView('home')} className="btn-back">
                    <ArrowLeft size={24} />
                </button>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>Registrar Moto</h2>
            </div>

            <form onSubmit={handleSubmit} className="login-card" style={{ maxWidth: '100%', animation: 'fadeIn 0.5s ease-out' }}>

                {/* Section 1: Owner Info */}
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#818cf8', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <User size={20} /> Información del Propietario
                    </h3>
                    <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                        <div className="form-group">
                            <label>Nombre Completo *</label>
                            <div className="input-wrapper">
                                <input required name="owner_name" value={formData.owner_name} onChange={handleInputChange} className="form-control" placeholder="Ej. Juan Pérez" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Cédula / NIT *</label>
                            <div className="input-wrapper">
                                <input required name="owner_id" value={formData.owner_id} onChange={handleInputChange} className="form-control" placeholder="Ej. 123456789" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Dirección</label>
                            <div className="input-wrapper">
                                <input name="owner_address" value={formData.owner_address} onChange={handleInputChange} className="form-control" placeholder="Dirección de residencia" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Correo Electrónico</label>
                            <div className="input-wrapper">
                                <input type="email" name="owner_email" value={formData.owner_email} onChange={handleInputChange} className="form-control" placeholder="ejemplo@correo.com" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Teléfono Fijo</label>
                            <div className="input-wrapper">
                                <input name="owner_phone" value={formData.owner_phone} onChange={handleInputChange} className="form-control" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Celular</label>
                            <div className="input-wrapper">
                                <input name="owner_mobile" value={formData.owner_mobile} onChange={handleInputChange} className="form-control" />
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ height: '1px', background: 'var(--border-color)', margin: '2rem 0' }}></div>

                {/* Section 2: Bike Info */}
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#34d399', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Bike size={20} /> Datos del Vehículo
                    </h3>
                    <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>

                        {/* Dynamic Dependent Dropdowns */}
                        <div className="form-group">
                            <label>Marca *</label>
                            <div className="input-wrapper">
                                <select required name="brand" value={formData.brand} onChange={handleInputChange} className="form-control custom-select">
                                    <option value="">Seleccione Marca</option>
                                    {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                                {formData.brand === 'Otra' && (
                                    <input
                                        name="custom_brand"
                                        value={formData.custom_brand}
                                        onChange={handleInputChange}
                                        className="form-control mt-2"
                                        placeholder="Especifique la marca"
                                        required
                                    />
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Tipo de Moto *</label>
                            <div className="input-wrapper">
                                <select required name="type" value={formData.type} onChange={handleInputChange} className="form-control custom-select" disabled={!formData.brand}>
                                    <option value="">Seleccione Tipo</option>
                                    {getTypes().map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                                {formData.type === 'Otra' && (
                                    <input
                                        name="custom_type"
                                        value={formData.custom_type}
                                        onChange={handleInputChange}
                                        className="form-control mt-2"
                                        placeholder="Especifique el tipo"
                                        required
                                    />
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Modelo *</label>
                            <div className="input-wrapper">
                                {(formData.brand !== 'Otra' && formData.type !== 'Otra' && getModels().length > 1) ? (
                                    <select required name="model" value={formData.model} onChange={handleInputChange} className="form-control custom-select" disabled={!formData.type}>
                                        <option value="">Seleccione Modelo</option>
                                        {getModels().map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                ) : (
                                    <input
                                        name="model"
                                        value={formData.model}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        placeholder={formData.type ? "Escriba el modelo" : "Seleccione tipo primero"}
                                        disabled={!formData.type && formData.type !== 'Otra'}
                                    />
                                )}

                                {formData.model === 'Otra' && (
                                    <input
                                        name="custom_model"
                                        value={formData.custom_model}
                                        onChange={handleInputChange}
                                        className="form-control mt-2"
                                        placeholder="Especifique el modelo"
                                        required
                                    />
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Placa *</label>
                            <div className="input-wrapper">
                                <input required name="license_plate" value={formData.license_plate} onChange={handleInputChange} className="form-control" style={{ textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px' }} placeholder="ABC-12D" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>F.V. SOAT</label>
                            <div className="input-wrapper">
                                <input type="date" name="soat_expiry" value={formData.soat_expiry} onChange={handleInputChange} className="form-control" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>F.V. Tecnomecánica</label>
                            <div className="input-wrapper">
                                <input type="date" name="technomechanical_expiry" value={formData.technomechanical_expiry} onChange={handleInputChange} className="form-control" />
                            </div>
                        </div>
                    </div>
                </div>

                <button disabled={loading} type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
                    <Save size={20} />
                    {loading ? 'Guardando...' : 'Guardar y Registrar'}
                </button>
            </form>
        </div>
    );

    const renderSearch = () => (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
            <div className="flex items-center gap-4 mb-6" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button onClick={() => setView('home')} className="btn-back">
                    <ArrowLeft size={24} />
                </button>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search className="text-muted" size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', zIndex: 10, color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Buscar por placa, nombre o documento..."
                        className="form-control"
                        style={{ paddingLeft: '3rem', width: '100%' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="users-table-container" style={{ flex: 1, overflow: 'auto' }}>
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Placa</th>
                            <th>Marca / Modelo</th>
                            <th>Propietario</th>
                            <th>Documento</th>
                            <th>Contacto</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Cargando...</td></tr>}
                        {!loading && motorcycles.length === 0 && (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No se encontraron motos registradas.</td></tr>
                        )}
                        {motorcycles.map(moto => (
                            <tr key={moto.id} className="hover:bg-slate-800/50 transition-colors">
                                <td data-label="Placa" onClick={() => { setSelectedMoto(moto); setView('profile'); }} style={{ cursor: 'pointer' }}>
                                    <span className="badge badge-active" style={{ fontSize: '0.9rem' }}>{moto.license_plate}</span>
                                </td>
                                <td data-label="Vehículo">
                                    <div className="user-details" style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span className="name">{moto.brand}</span>
                                        <span className="username">{moto.model} • {moto.type}</span>
                                    </div>
                                </td>
                                <td data-label="Propietario" style={{ fontWeight: 500, color: '#a5b4fc' }}>{moto.owner_name}</td>
                                <td data-label="Documento">{moto.owner_id}</td>
                                <td data-label="Contacto">
                                    <div className="user-details">
                                        <span className="name" style={{ fontSize: '0.9rem' }}>{moto.owner_mobile}</span>
                                        <span className="username">{moto.owner_email}</span>
                                    </div>
                                </td>
                                <td data-label="Acciones">
                                    <button
                                        onClick={() => { setSelectedMoto(moto); setView('profile'); }}
                                        className="btn-icon btn-edit"
                                        title="Ver Perfil"
                                    >
                                        <FileText size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderProfile = () => (
        <div style={{ padding: '1.5rem', height: '100%', overflow: 'auto' }}>
            <div className="flex items-center gap-4 mb-6" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button onClick={() => setView('search')} className="btn-back"><ArrowLeft size={24} /></button>
                <div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {selectedMoto.brand} {selectedMoto.model}
                        <span className="badge badge-active" style={{ marginLeft: '1rem', fontSize: '1rem' }}>{selectedMoto.license_plate}</span>
                    </h2>
                    <p className="text-muted" style={{ margin: 0 }}>Propietario: {selectedMoto.owner_name}</p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
                <button
                    className={`tab-btn ${activeTab === 'maintenance' ? 'active' : ''}`}
                    onClick={() => setActiveTab('maintenance')}
                    style={{ padding: '1rem 2rem', background: 'none', border: 'none', color: activeTab === 'maintenance' ? '#818cf8' : 'var(--text-muted)', borderBottom: activeTab === 'maintenance' ? '2px solid #818cf8' : 'none', cursor: 'pointer', fontWeight: 600, display: 'flex', gap: '0.5rem', alignItems: 'center' }}
                >
                    <PenTool size={18} /> Mantenimiento
                </button>
                <button
                    className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => setActiveTab('history')}
                    style={{ padding: '1rem 2rem', background: 'none', border: 'none', color: activeTab === 'history' ? '#818cf8' : 'var(--text-muted)', borderBottom: activeTab === 'history' ? '2px solid #818cf8' : 'none', cursor: 'pointer', fontWeight: 600, display: 'flex', gap: '0.5rem', alignItems: 'center' }}
                >
                    <History size={18} /> Historial
                </button>
            </div>

            {activeTab === 'maintenance' && (
                <div className="login-card animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Wrench size={20} className="text-primary" /> Registrar Servicios</h3>

                    {/* Item Entry Section */}
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
                        <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#818cf8' }}>Agregar Detalle</h4>
                        <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label>Tipo de Servicio</label>
                                <select name="service_type" value={currentService.service_type} onChange={handleServiceInput} className="form-control custom-select">
                                    <option value="">Seleccione...</option>
                                    <option value="Mantenimiento Preventivo">Mantenimiento Preventivo</option>
                                    <option value="Cambio de Aceite">Cambio de Aceite</option>
                                    <option value="Reparación Motor">Reparación Motor</option>
                                    <option value="Sistema Eléctrico">Sistema Eléctrico</option>
                                    <option value="Frenos">Frenos</option>
                                    <option value="Llantas">Llantas</option>
                                    <option value="Kit de Arrastre">Kit de Arrastre</option>
                                    <option value="Lavado">Lavado</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Costo Item ($)</label>
                                <input type="number" name="cost" value={currentService.cost} onChange={handleServiceInput} className="form-control" placeholder="0" />
                            </div>
                        </div>
                        <div className="form-group" style={{ marginTop: '0.5rem' }}>
                            <label>Descripción</label>
                            <input type="text" name="description" value={currentService.description} onChange={handleServiceInput} className="form-control" placeholder="Detalle específico..." />
                        </div>
                        <button type="button" onClick={addService} className="btn-secondary" style={{ marginTop: '0.5rem', width: '100%' }}>
                            <Plus size={16} /> Agregar a la Lista
                        </button>
                    </div>

                    {/* List of Added Services */}
                    {servicesList.length > 0 && (
                        <div style={{ marginBottom: '2rem' }}>
                            <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Servicios a Registrar ({servicesList.length})</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {servicesList.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-color)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                        <div>
                                            <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{item.service_type}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.description}</div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <span style={{ fontWeight: 'bold' }}>${parseInt(item.cost || 0).toLocaleString()}</span>
                                            <button onClick={() => removeService(idx)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><ArrowLeft size={16} style={{ transform: 'rotate(45deg)' }} /></button>
                                        </div>
                                    </div>
                                ))}
                                <div style={{ textAlign: 'right', fontWeight: 'bold', marginTop: '0.5rem', fontSize: '1.2rem', color: '#10b981' }}>
                                    Total: ${calculateTotal().toLocaleString()}
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleMaintenanceSubmit}>
                        <div className="form-group">
                            <label>Kilometraje Actual (General)</label>
                            <div className="input-wrapper">
                                <input type="number" name="mileage" value={maintenanceMeta.mileage} onChange={handleMetaInput} className="form-control" placeholder="Ej. 15000" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Notas del Mecánico</label>
                            <div className="input-wrapper">
                                <textarea name="mechanic_notes" value={maintenanceMeta.mechanic_notes} onChange={handleMetaInput} className="form-control" rows="2" placeholder="Observaciones generales..."></textarea>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Evidencia Fotográfica</label>
                            <div className="input-wrapper" style={{ border: '1px dashed var(--border-color)', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    id="photo-upload"
                                    onChange={(e) => setPhotos(e.target.files)}
                                    style={{ display: 'none' }}
                                />
                                <label htmlFor="photo-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: '#818cf8' }}>
                                    <PenTool size={24} />
                                    <span>{photos.length > 0 ? `${photos.length} archivos seleccionados` : 'Clic para subir fotos'}</span>
                                </label>
                            </div>
                        </div>

                        <button disabled={loading || servicesList.length === 0} type="submit" className="btn-primary w-full"><Save size={20} /> Guardar Todos los Servicios</button>
                    </form>
                </div>
            )}

            {activeTab === 'history' && (
                <div className="timeline-container animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    {maintenanceRecords.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                            <ClipboardList size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                            <p>No hay historial de mantenimiento registrado.</p>
                        </div>
                    ) : (
                        <div className="records-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {maintenanceRecords.map(record => (
                                <div key={record.id} className="record-card" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#818cf8', margin: 0 }}>
                                            {record.service_type === 'Servicios Múltiples' ? 'Mantenimiento General' : record.service_type}
                                        </h4>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> {record.service_date}</span>
                                        </div>
                                    </div>

                                    {/* Handle JSON description for multiservices */}
                                    {(() => {
                                        try {
                                            const parsed = JSON.parse(record.description);
                                            if (Array.isArray(parsed)) {
                                                return (
                                                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '8px', margin: '0.5rem 0' }}>
                                                        {parsed.map((sub, i) => (
                                                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.25rem', borderBottom: '1px dashed #444', paddingBottom: '0.25rem' }}>
                                                                <span>• {sub.service_type}: {sub.description}</span>
                                                                <span style={{ color: '#10b981' }}>${parseInt(sub.cost || 0).toLocaleString()}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                );
                                            }
                                            return <p style={{ margin: 0, color: 'var(--text-color)' }}>{record.description}</p>;
                                        } catch (e) {
                                            return <p style={{ margin: 0, color: 'var(--text-color)' }}>{record.description}</p>;
                                        }
                                    })()}

                                    {record.mechanic_notes && <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontStyle: 'italic', margin: '0.5rem 0' }}>" {record.mechanic_notes} "</p>}

                                    {record.photos && record.photos.length > 0 && (
                                        <div style={{ marginTop: '0.5rem' }}>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Evidencia:</p>
                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                {record.photos.map((photo, index) => (
                                                    <a key={index} href={`http://localhost/jcr/${photo}`} target="_blank" rel="noopener noreferrer">
                                                        <img
                                                            src={`http://localhost/jcr/${photo}`}
                                                            alt="Evidencia"
                                                            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                                                        />
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: '0.9rem' }}>Km: {record.mileage || 'N/A'}</span>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mecánico: {record.mechanic_name || 'N/A'}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#10b981', marginRight: '1rem' }}>$ {parseInt(record.cost).toLocaleString()}</span>

                                            <button
                                                onClick={() => sendWhatsApp(record)}
                                                className="btn-icon"
                                                title="Notificar por WhatsApp"
                                                style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '0.5rem' }}
                                            >
                                                <WhatsAppIcon size={24} />
                                            </button>

                                            <button
                                                onClick={() => generatePDF(record)}
                                                className="btn-icon"
                                                title="Descargar PDF"
                                                style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}
                                            >
                                                <Printer size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    return (
        <div style={{ height: '100%' }}>
            {view === 'home' && renderHome()}
            {view === 'register' && renderRegister()}
            {view === 'search' && renderSearch()}
            {view === 'profile' && selectedMoto && renderProfile()}
        </div>
    );
}

export default MotorcyclesPage;
