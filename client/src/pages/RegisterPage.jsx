import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { showToast } from '../utils/toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    city: ''
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  function validate() {
    const nextErrors = {};

    if (!form.firstName.trim() || form.firstName.trim().length < 2) nextErrors.firstName = 'Prenumele este prea scurt.';
    if (!form.lastName.trim() || form.lastName.trim().length < 2) nextErrors.lastName = 'Numele este prea scurt.';
    if (!/\S+@\S+\.\S+/.test(form.email)) nextErrors.email = 'Email invalid.';
    if (!form.password || form.password.length < 8) nextErrors.password = 'Parola trebuie să aibă minim 8 caractere.';

    if (form.phone && !/^[0-9+\s()-]{6,20}$/.test(form.phone.trim())) {
      nextErrors.phone = 'Telefon invalid.';
    }

    if (form.city && form.city.trim().length < 2) {
      nextErrors.city = 'Oraș invalid.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setServerError('');

    if (!validate()) return;

    setLoading(true);

    try {
      await register({
        ...form,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        city: form.city.trim()
      });

      showToast('Contul a fost creat cu succes.');
      navigate('/');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Înregistrarea a eșuat.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container section narrow">
      <form className="card form" onSubmit={handleSubmit}>
        <h1>Creare cont</h1>

        {serverError && <div className="alert">{serverError}</div>}

        <div className="form-grid">
          <label>
            Prenume
            <input name="firstName" value={form.firstName} onChange={handleChange} required />
            {errors.firstName && <small className="field-error">{errors.firstName}</small>}
          </label>

          <label>
            Nume
            <input name="lastName" value={form.lastName} onChange={handleChange} required />
            {errors.lastName && <small className="field-error">{errors.lastName}</small>}
          </label>

          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
            {errors.email && <small className="field-error">{errors.email}</small>}
          </label>

          <label>
            Parolă
            <input name="password" type="password" value={form.password} onChange={handleChange} required />
            {errors.password && <small className="field-error">{errors.password}</small>}
          </label>

          <label>
            Telefon
            <input name="phone" value={form.phone} onChange={handleChange} />
            {errors.phone && <small className="field-error">{errors.phone}</small>}
          </label>

          <label>
            Oraș
            <input name="city" value={form.city} onChange={handleChange} />
            {errors.city && <small className="field-error">{errors.city}</small>}
          </label>
        </div>

        <button className="btn" disabled={loading}>
          {loading ? 'Se creează contul...' : 'Creează cont'}
        </button>
      </form>
    </div>
  );
}