import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
    UserPlus,
    Pencil,
    Trash2,
    CheckCircle,
    XCircle,
    Power,
    Shield,
    User,
    X
} from 'lucide-react';

// ... (other imports)

function UsersPage({ currentUser }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        full_name: '',
        role: 'mechanic'
    });

    const [msg, setMsg] = useState('');

    const fetchUsers = async () => {
        try {
            const res = await fetch('http://localhost/jcr/api/users.php');
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const openCreateModal = () => {
        setIsEditing(false);
        setFormData({ username: '', password: '', full_name: '', role: 'mechanic' });
        setMsg('');
        setShowModal(true);
    };

    const openEditModal = (user) => {
        setIsEditing(true);
        setCurrentUserId(user.id);
        setFormData({
            username: user.username,
            password: '',
            full_name: user.full_name,
            role: user.role
        });
        setMsg('');
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg('');

        // Validations
        if (isEditing) {
            if (currentUser.role !== 'developer' && currentUser.role !== 'owner') {
                Swal.fire('Error', 'Acceso denegado: Solo Administrador y Dev pueden editar.', 'error');
                return;
            }
        } else {
            if (!['developer', 'owner', 'mechanic'].includes(currentUser.role)) {
                Swal.fire('Error', 'Acceso denegado.', 'error');
                return;
            }
        }

        const url = 'http://localhost/jcr/api/users.php';
        const method = isEditing ? 'PUT' : 'POST';
        const body = isEditing ?
            { ...formData, id: currentUserId, requester_role: currentUser.role } :
            { ...formData, requester_role: currentUser.role };

        const actionText = isEditing ? 'actualizando' : 'creando';

        try {
            // Optional: Show loading?
            // Swal.showLoading(); 

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();

            if (data.status === 'success') {
                setShowModal(false);
                Swal.fire({
                    title: '¡Éxito!',
                    text: isEditing ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
                fetchUsers();
            } else {
                Swal.fire('Error', data.message || 'Error desconocido', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Error de conexión con el servidor', 'error');
        }
    };

    const toggleStatus = async (id, currentStatus, role) => {
        if (!['developer', 'owner'].includes(currentUser.role)) return;
        if (role === 'developer') return;

        const newStatus = currentStatus == 1 ? 0 : 1;

        try {
            await fetch('http://localhost/jcr/api/users.php', {
                method: 'PUT',
                body: JSON.stringify({ id, status: newStatus, requester_role: currentUser.role })
            });
            fetchUsers();
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true
            });
            Toast.fire({
                icon: 'success',
                title: `Usuario ${newStatus == 1 ? 'activado' : 'desactivado'}`
            });
        } catch (err) {
            Swal.fire('Error', 'No se pudo cambiar el estado', 'error');
        }
    };

    const deleteUser = async (id, role, name) => {
        if (!['developer', 'owner'].includes(currentUser.role)) return;
        if (role === 'developer') return;

        const result = await Swal.fire({
            title: `¿Eliminar a ${name}?`,
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            background: '#1e293b',
            color: '#fff'
        });

        if (result.isConfirmed) {
            try {
                await fetch(`http://localhost/jcr/api/users.php?id=${id}&requester_role=${currentUser.role}`, {
                    method: 'DELETE'
                });
                Swal.fire({
                    title: 'Eliminado',
                    text: 'El usuario ha sido eliminado.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                    background: '#1e293b',
                    color: '#fff'
                });
                fetchUsers();
            } catch (err) {
                Swal.fire('Error', 'Hubo un problema al eliminar', 'error');
            }
        }
    }

    const getRoleName = (role) => {
        switch (role) {
            case 'developer': return 'Desarrollador';
            case 'owner': return 'Dueño';
            case 'mechanic': return 'Mecánico';
            default: return role;
        }
    };

    return (
        <div className="p-4 md:p-8">
            {/* Header */}
            <div className="page-header">
                <div className="page-title">
                    <h2>Gestión de Usuarios</h2>
                    <p>Administra el acceso al sistema JCR Motos</p>
                </div>

                {['developer', 'owner', 'mechanic'].includes(currentUser.role) && (
                    <button onClick={openCreateModal} className="btn-add">
                        <UserPlus size={20} />
                        <span>Nuevo Usuario</span>
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Usuario / Nombre</th>
                            <th>Rol</th>
                            <th>Estado</th>
                            <th style={{ textAlign: 'right' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id}>
                                <td data-label="Usuario / Nombre">
                                    <div className="user-cell-profile">
                                        <div className={`avatar-circle ${u.role === 'developer' ? 'avatar-dev' : ''}`}>
                                            {u.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="user-details">
                                            <span className="name">{u.full_name}</span>
                                            <span className="username">@{u.username}</span>
                                        </div>
                                    </div>
                                </td>
                                <td data-label="Rol">
                                    <span className="badge badge-role">
                                        {u.role === 'developer' ? <Shield size={12} /> : <User size={12} />}
                                        {getRoleName(u.role)}
                                    </span>
                                </td>
                                <td data-label="Estado">
                                    <span className={`badge ${u.status == 1 ? 'badge-active' : 'badge-inactive'}`}>
                                        {u.status == 1 ? 'ACTIVO' : 'INACTIVO'}
                                    </span>
                                </td>
                                <td data-label="Acciones">
                                    <div className="actions-cell">
                                        {['developer', 'owner'].includes(currentUser.role) && u.role !== 'developer' ? (
                                            <>
                                                <button
                                                    onClick={() => openEditModal(u)}
                                                    className="btn-icon btn-edit"
                                                    title="Editar"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => toggleStatus(u.id, u.status, u.role)}
                                                    className={`btn-icon btn-toggle ${u.status == 1 ? 'on' : 'off'}`}
                                                    title={u.status == 1 ? "Desactivar" : "Activar"}
                                                >
                                                    <Power size={18} />
                                                </button>
                                                <button
                                                    onClick={() => deleteUser(u.id, u.role, u.full_name)}
                                                    className="btn-icon btn-delete"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </>
                                        ) : (
                                            u.role === 'developer' ? (
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Protegido</span>
                                            ) : (
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Ver solo</span>
                                            )
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && !loading && (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                    No hay usuarios registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h3>
                            <button onClick={() => setShowModal(false)} className="modal-close">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                {msg && <div className="error-msg" style={{ marginBottom: '1rem' }}>{msg}</div>}

                                <label className="modal-label">Nombre Completo</label>
                                <input
                                    type="text"
                                    className="modal-input"
                                    placeholder="Ej. Juan Pérez"
                                    value={formData.full_name}
                                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                    required
                                />

                                <label className="modal-label">Usuario (Login)</label>
                                <input
                                    type="text"
                                    className="modal-input"
                                    placeholder="Ej. juanperez"
                                    value={formData.username}
                                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                                    required
                                />

                                <label className="modal-label">Rol</label>
                                <select
                                    className="modal-input"
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    style={{ appearance: 'none', backgroundImage: 'none' }} // Simplified style
                                >
                                    <option value="mechanic">Mecánico</option>
                                    <option value="owner">Dueño</option>
                                </select>

                                <label className="modal-label">
                                    {isEditing ? 'Nueva Contraseña (Opcional)' : 'Contraseña'}
                                </label>
                                <input
                                    type="password"
                                    className="modal-input"
                                    placeholder={isEditing ? "Dejar vacío para mantener actual" : "••••••••"}
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    required={!isEditing}
                                />
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="btn-secondary"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    style={{ margin: 0, flex: 1 }}
                                >
                                    {isEditing ? 'Guardar Cambios' : 'Crear Usuario'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UsersPage;
