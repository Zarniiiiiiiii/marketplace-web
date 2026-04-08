import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { showToast } from '../utils/toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(form);
      showToast('Te-ai autentificat cu succes.');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Autentificarea a eșuat.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container section narrow">
      <form className="card form" onSubmit={handleSubmit}>
        <h1>Autentificare</h1>

        {error && <div className="alert">{error}</div>}

        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>

        <label>
          Parolă
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </label>

        <button className="btn" disabled={loading}>
          {loading ? 'Se autentifică...' : 'Autentificare'}
        </button>
      </form>
    </div>
  );
}