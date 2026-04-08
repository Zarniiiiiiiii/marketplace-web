import { useEffect, useMemo, useState } from 'react';
import http from '../api/http';
import CarCard from '../components/CarCard';
import LoadingCard from '../components/LoadingCard';
import EmptyState from '../components/EmptyState';
import { showToast } from '../utils/toast';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  async function loadFavorites() {
    setLoading(true);
    const response = await http.get('/favorites');
    setFavorites(response.data.favorites);
    setLoading(false);
  }

  useEffect(() => {
    loadFavorites();
  }, []);

  async function handleFavoriteToggle(listingId) {
    await http.post(`/favorites/${listingId}`);
    showToast('Anunțul a fost scos din favorite.');
    await loadFavorites();
  }

  const filteredFavorites = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return favorites;

    return favorites.filter((item) => {
      const listing = item.listing;
      return (
        listing.title.toLowerCase().includes(normalized) ||
        listing.brand.toLowerCase().includes(normalized) ||
        listing.model.toLowerCase().includes(normalized) ||
        listing.locationCity.toLowerCase().includes(normalized)
      );
    });
  }, [favorites, search]);

  return (
    <div className="container section">
      <div className="section__header compact">
        <div>
          <h1>Favorite</h1>
          <p>Anunțurile salvate de utilizatorul autentificat.</p>
        </div>
      </div>

      <div className="table-card favorites-toolbar">
        <input
          type="text"
          placeholder="Caută în favorite după titlu, marcă, model sau oraș"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {loading ? (
        <LoadingCard text="Se încarcă favoritele..." />
      ) : filteredFavorites.length === 0 ? (
        <EmptyState
          title="Nu există favorite care să corespundă căutării."
          description="Încearcă alt termen sau adaugă anunțuri noi la favorite."
        />
      ) : (
        <div className="cards-grid">
          {filteredFavorites.map((favorite) => (
            <CarCard
              key={favorite.id}
              listing={favorite.listing}
              showFavoriteButton
              isFavorite
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}