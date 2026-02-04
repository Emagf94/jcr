import { useState } from 'react';
import { Lock, Save } from 'lucide-react';
import Swal from 'sweetalert2';
import { API_URL } from '../config';

function SettingsPage({ currentUser }) {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            Swal.fire({
                title: 'Error',
                text: 'Las nuevas contraseñas no coinciden.',
                icon: 'error',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        if (formData.newPassword.length < 6) {
            Swal.fire({
                title: 'Error',
                text: 'La contraseña debe tener al menos 6 caracteres.',
                icon: 'error',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/users.php`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: currentUser.id,
                    password: formData.newPassword
                })
            });

            const data = await res.json();

            if (data.status === 'success') {
                Swal.fire({
                    title: '¡Actualizado!',
                    text: 'Contraseña actualizada exitosamente.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
                setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                Swal.fire('Error', data.message || 'Error al actualizar', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Error de conexión', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-2xl mx-auto">
            <div className="settings-card">
                <div className="settings-header">
                    <div className="icon-wrapper">
                        <Lock size={24} />
                    </div>
                    <div className="title-wrapper">
                        <h2>Seguridad de la Cuenta</h2>
                        <p>Actualiza tu contraseña de acceso</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="settings-form">
                    <div className="form-group">
                        <label>Nueva Contraseña</label>
                        <input
                            type="password"
                            placeholder="Mínimo 6 caracteres"
                            value={formData.newPassword}
                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirmar Nueva Contraseña</label>
                        <input
                            type="password"
                            placeholder="Repite la nueva contraseña"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-save" disabled={loading}>
                            <Save size={18} />
                            <span>{loading ? 'Guardando...' : 'Actualizar Contraseña'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SettingsPage;
