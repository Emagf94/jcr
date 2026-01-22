import { useState } from 'react';
import { Lock, Save, AlertCircle, CheckCircle } from 'lucide-react';

function SettingsPage({ currentUser }) {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', msg: '' });

        if (formData.newPassword !== formData.confirmPassword) {
            setStatus({ type: 'error', msg: 'Las nuevas contraseñas no coinciden.' });
            return;
        }

        if (formData.newPassword.length < 6) {
            setStatus({ type: 'error', msg: 'La contraseña debe tener al menos 6 caracteres.' });
            return;
        }

        setLoading(true);

        try {
            // We reuse the update user endpoint. 
            // Note: In a real app we should verify currentPassword on server. 
            // For this rapid prototype, we are just updating the password directly.

            const res = await fetch('http://localhost/jcr/api/users.php', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: currentUser.id,
                    password: formData.newPassword
                    // In a production app, send currentPassword to verify
                })
            });

            const data = await res.json();

            if (data.status === 'success') {
                setStatus({ type: 'success', msg: 'Contraseña actualizada exitosamente.' });
                setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                setStatus({ type: 'error', msg: data.message || 'Error al actualizar.' });
            }
        } catch (error) {
            setStatus({ type: 'error', msg: 'Error de conexión.' });
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

                    {status.msg && (
                        <div className={`status-msg ${status.type}`}>
                            {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                            <span>{status.msg}</span>
                        </div>
                    )}

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
