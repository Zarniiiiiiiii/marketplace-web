import { useEffect, useState } from 'react';
import http from '../api/http';
import { useAuth } from '../contexts/AuthContext';
import LoadingCard from '../components/LoadingCard';
import EmptyState from '../components/EmptyState';
import { formatDate, formatPrice } from '../utils/format';
import CarCard from '../components/CarCard';
import { showToast } from '../utils/toast';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();

  const [stats, setStats] = useState(null);
  const [recentListings, setRecentListings] = useState([]);
  const [favoriteListings, setFavoriteListings] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);

    const [myListingsResponse, favoritesResponse] = await Promise.all([
      http.get('/listings/mine'),
      http.get('/favorites')
    ]);

    const myListings = myListingsResponse.data.listings;
    const favorites = favoritesResponse.data.favorites.map((item) => item.listing);

    const totalListings = myListings.length;
    const approvedListings = myListings.filter((item) => item.status === 'APPROVED').length;
    const pendingListings = myListings.filter((item) => item.status === 'PENDING').length;
    const rejectedListings = myListings.filter((item) => item.status === 'REJECTED').length;
    const soldListings = myListings.filter((item) => item.isSold).length;

    setStats({
      totalListings,
      approvedListings,
      pendingListings,
      rejectedListings,
      soldListings,
      favoritesCount: favorites.length
    });

    setRecentListings(myListings.slice(0, 4));
    setFavoriteListings(favorites.slice(0, 4));
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleFavoriteToggle(listingId) {
    await http.post(`/favorites/${listingId}`);
    showToast('Favoritul a fost actualizat.');
    await loadData();
  }

  if (authLoading || loading) {
    return (
      <div className="container section">
        <LoadingCard text="Se încarcă profilul..." />
      </div>
    );
  }

  return (
    <div className="container section profile-space">
      <div className="section__header compact">
        <div>
          <h1>Profilul meu</h1>
          <p>Rezumatul contului, anunțurilor și favoritelor tale.</p>
        </div>
      </div>

      <div className="profile-hero card">
        <div>
          <h2>{user.firstName} {user.lastName}</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Telefon:</strong> {user.phone || '-'}</p>
          <p><strong>Oraș:</strong> {user.city || '-'}</p>
          <p><strong>Rol:</strong> {user.role}</p>
          <p><strong>Cont creat la:</strong> {formatDate(user.createdAt)}</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="card stat-card"><strong>{stats.totalListings}</strong><span>Anunțuri totale</span></div>
        <div className="card stat-card"><strong>{stats.approvedListings}</strong><span>Aprobate</span></div>
        <div className="card stat-card"><strong>{stats.pendingListings}</strong><span>Pending</span></div>
        <div className="card stat-card"><strong>{stats.rejectedListings}</strong><span>Respinse</span></div>
        <div className="card stat-card"><strong>{stats.soldListings}</strong><span>Vândute</span></div>
      </div>

      <div className="stats-grid">
        <div className="card stat-card"><strong>{stats.favoritesCount}</strong><span>Favorite</span></div>
        <div className="card stat-card"><strong>{stats.approvedListings > 0 ? Math.round((stats.soldListings / Math.max(stats.approvedListings, 1)) * 100) : 0}%</strong><span>Rată vândute</span></div>
        <div className="card stat-card"><strong>{recentListings.length}</strong><span>Recente afișate</span></div>
        <div className="card stat-card"><strong>{favoriteListings.length}</strong><span>Favorite afișate</span></div>
        <div className="card stat-card"><strong>{user.role === 'ADMIN' ? 'Admin' : 'User'}</strong><span>Tip cont</span></div>
      </div>

      <section className="section section--topless">
        <div className="section__header compact">
          <div>
            <h2>Anunțuri recente publicate de tine</h2>
            <p>Ultimele anunțuri create în contul curent.</p>
          </div>
        </div>

        {recentListings.length === 0 ? (
          <EmptyState
            title="Nu ai încă anunțuri publicate."
            description="După ce publici anunțuri, ele vor apărea aici."
          />
        ) : (
          <div className="cards-grid">
            {recentListings.map((listing) => (
              <CarCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      <section className="section section--topless">
        <div className="section__header compact">
          <div>
            <h2>Favorite recente</h2>
            <p>Primele anunțuri salvate în favorite.</p>
          </div>
        </div>

        {favoriteListings.length === 0 ? (
          <EmptyState
            title="Nu ai favorite."
            description="Adaugă anunțuri la favorite și le vei vedea aici."
          />
        ) : (
          <div className="cards-grid">
            {favoriteListings.map((listing) => (
              <CarCard
                key={listing.id}
                listing={listing}
                showFavoriteButton
                isFavorite
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>
        )}
      </section>

      <div className="table-card">
        <h2>Rezumat pentru documentație</h2>
        <div className="licence-summary">
          <p><strong>Frontend:</strong> React, React Router, componente reutilizabile, context pentru autentificare.</p>
          <p><strong>Backend:</strong> Express, rute REST, validare cu Zod, autentificare JWT.</p>
          <p><strong>Baza de date:</strong> Prisma ORM și SQLite.</p>
          <p><strong>Funcții implementate:</strong> autentificare, favorite, anunțuri, upload imagini, admin panel, moderare, filtrare, sortare, paginare, anunțuri similare.</p>
          <p><strong>Algoritmi și logică:</strong> filtrare după mai multe criterii, sortare multiplă, relevanță după câmpuri text, recomandări simple după marcă, model și preț.</p>
        </div>
      </div>
    </div>
  );
}