import { useState } from 'react';
import Dashboard from './components/Dashboard';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  // Check if user is in localStorage to persist login across reloads
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('jcr_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost/jcr/api/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
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
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('jcr_user');
    setUsername('');
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

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <div className="input-wrapper">
              <input
                type="text"
                id="username"
                className="form-control"
                placeholder="Ingresa tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            {!isLoading && <span>→</span>}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
