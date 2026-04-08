import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import http from '../api/http';
import ListingForm from '../components/ListingForm';
import { showToast } from '../utils/toast';

export default function AddListingPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(payload) {
    setLoading(true);
    setError('');

    try {
      await http.post('/listings', payload);
      showToast('Anunțul a fost adăugat cu succes.');
      navigate('/anunturile-mele');
    } catch (err) {
      setError(err.response?.data?.message || 'Nu am putut salva anunțul.');
      setLoading(false);
    }
  }

  return (
    <div className="container section">
      <div className="section__header compact">
        <div>
          <h1>Adaugă anunț</h1>
          <p>Completează datele mașinii și datele de contact.</p>
        </div>
      </div>

      {error && <div className="alert container--small">{error}</div>}

      <ListingForm onSubmit={handleSubmit} loading={loading} submitLabel="Publică anunțul" />
    </div>
  );
}