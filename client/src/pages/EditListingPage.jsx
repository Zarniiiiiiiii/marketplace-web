import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import http from '../api/http';
import ListingForm from '../components/ListingForm';
import LoadingCard from '../components/LoadingCard';
import { showToast } from '../utils/toast';

export default function EditListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    http.get(`/listings/${id}`)
      .then((response) => setListing(response.data.listing))
      .catch((err) => setError(err.response?.data?.message || 'Nu am putut încărca anunțul.'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(payload) {
    setSaving(true);
    setError('');

    try {
      await http.put(`/listings/${id}`, payload);
      showToast('Anunțul a fost actualizat.');
      navigate('/anunturile-mele');
    } catch (err) {
      setError(err.response?.data?.message || 'Nu am putut actualiza anunțul.');
      setSaving(false);
    }
  }

  if (loading) return <div className="container section"><LoadingCard text="Se încarcă anunțul..." /></div>;

  return (
    <div className="container section">
      <div className="section__header compact">
        <div>
          <h1>Editează anunț</h1>
          <p>Actualizează datele mașinii, imaginile și contactul.</p>
        </div>
      </div>

      {error && <div className="alert container--small">{error}</div>}

      {listing && (
        <ListingForm
          initialValues={listing}
          onSubmit={handleSubmit}
          loading={saving}
          submitLabel="Actualizează anunțul"
        />
      )}
    </div>
  );
}