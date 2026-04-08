import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import http from '../api/http';
import { formatDate } from '../utils/format';
import LoadingCard from '../components/LoadingCard';
import EmptyState from '../components/EmptyState';
import { showToast } from '../utils/toast';

export default function MyListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadListings() {
    setLoading(true);
    const response = await http.get('/listings/mine');
    setListings(response.data.listings);
    setLoading(false);
  }

  useEffect(() => {
    loadListings();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm('Sigur vrei să ștergi acest anunț?')) return;

    await http.delete(`/listings/${id}`);
    showToast('Anunțul a fost șters.');
    await loadListings();
  }

  async function handleMarkSold(id) {
    await http.patch(`/listings/${id}/sold`);
    showToast('Anunțul a fost marcat ca vândut.');
    await loadListings();
  }

  return (
    <div className="container section">
      <div className="section__header">
        <div>
          <h1>Anunțurile mele</h1>
          <p>Poți edita, marca drept vândut sau șterge anunțurile tale.</p>
        </div>
        <Link className="btn" to="/adauga-anunt">Adaugă anunț</Link>
      </div>

      {loading ? (
        <LoadingCard text="Se încarcă anunțurile tale..." />
      ) : listings.length === 0 ? (
        <EmptyState
          title="Nu ai încă anunțuri."
          description="Publică primul tău anunț și îl vei vedea aici."
        />
      ) : (
        <div className="table-card">
          <table className="table">
            <thead>
              <tr>
                <th>Titlu</th>
                <th>Status</th>
                <th>Publicat</th>
                <th>Vândut</th>
                <th>Data</th>
                <th>Observații</th>
                <th>Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing) => (
                <tr key={listing.id}>
                  <td>{listing.title}</td>
                  <td>{listing.status}</td>
                  <td>{listing.isPublished ? 'Da' : 'Nu'}</td>
                  <td>{listing.isSold ? 'Da' : 'Nu'}</td>
                  <td>{formatDate(listing.createdAt)}</td>
                  <td>
                    {listing.status === 'REJECTED' && listing.rejectionReason
                      ? listing.rejectionReason
                      : '-'}
                  </td>
                  <td className="table-actions">
                    <Link className="btn btn--ghost" to={`/editeaza-anunt/${listing.id}`}>Editează</Link>
                    {!listing.isSold && (
                      <button className="btn btn--ghost" onClick={() => handleMarkSold(listing.id)}>
                        Marchează vândut
                      </button>
                    )}
                    <button className="btn btn--ghost" onClick={() => handleDelete(listing.id)}>Șterge</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}