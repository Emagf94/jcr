
import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import { API_URL } from './config';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const checkSession = () => {
    const stored = localStorage.getItem('user_session');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  };

  useEffect(() => {
    checkSession();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // Set loading to true when login attempt starts

    try {
      const response = await fetch(`${API_URL}/login.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setUser(data.user);
        localStorage.setItem('jcr_user', JSON.stringify(data.user));
      } else {
        setError(data.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      console.error(err);
      setError('Error de red. Asegúrate de que XAMPP esté ejecutándose.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('jcr_user');
    setEmail('');
    setPassword('');
  };

  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img
            src="/jcr.png"
            alt="JCR Motos Logo"
            style={{ width: '120px', height: '120px', objectFit: 'contain', margin: '0 auto 1rem auto', display: 'block' }}
          />
          <h1>Bienvenido de nuevo</h1>
          <p>Ingresa a tu cuenta JCR Motos</p>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <div className="input-wrapper">
              <input
                type="text"
                id="username"
                className="form-control"
                placeholder="Ingresa tu usuario o email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
              />
              <span className="input-icon">👤</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-wrapper">
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <span className="input-icon">🔒</span>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            {!loading && <span>→</span>}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
