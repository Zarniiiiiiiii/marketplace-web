import { useEffect, useMemo, useState } from 'react';
import http from '../api/http';
import CarCard from '../components/CarCard';
import ListingFilters from '../components/ListingFilters';
import { useAuth } from '../contexts/AuthContext';
import LoadingCard from '../components/LoadingCard';
import EmptyState from '../components/EmptyState';
import { showToast } from '../utils/toast';

const defaultFilters = {
  search: '',
  brand: '',
  model: '',
  fuelType: '',
  transmission: '',
  city: '',
  minPrice: '',
  maxPrice: '',
  minYear: '',
  maxYear: '',
  maxMileage: '',
  sort: 'latest',
  page: 1,
  pageSize: 12
};

export default function ListingsPage() {
  const [filters, setFilters] = useState(defaultFilters);
  const [listings, setListings] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params.set(key, String(value));
      }
    });

    return params.toString();
  }, [filters]);

  useEffect(() => {
    setLoading(true);

    http.get(`/listings?${queryString}`)
      .then((response) => {
        setListings(response.data.listings);
        setPagination(response.data.pagination);
      })
      .finally(() => setLoading(false));
  }, [queryString]);

  useEffect(() => {
    if (!isAuthenticated) {
      setFavoriteIds([]);
      return;
    }

    http.get('/favorites').then((response) => {
      setFavoriteIds(response.data.favorites.map((item) => item.listing.id));
    });
  }, [isAuthenticated]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFilters((prev) => {
      const next = { ...prev, [name]: value, page: 1 };

      if (name === 'brand') {
        next.model = '';
      }

      return next;
    });
  }

  function handleReset() {
    setFilters(defaultFilters);
  }

  async function handleFavoriteToggle(listingId) {
    if (!isAuthenticated) return;

    const response = await http.post(`/favorites/${listingId}`);

    setFavoriteIds((prev) =>
      response.data.isFavorite
        ? [...new Set([...prev, listingId])]
        : prev.filter((id) => id !== listingId)
    );

    showToast(
      response.data.isFavorite
        ? 'Anunțul a fost adăugat la favorite.'
        : 'Anunțul a fost scos din favorite.'
    );
  }

  function goToPage(page) {
    setFilters((prev) => ({
      ...prev,
      page
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="container section listings-layout">
      <ListingFilters filters={filters} onChange={handleChange} onReset={handleReset} />

      <section>
        <div className="section__header compact">
          <div>
            <h2>Anunțuri auto</h2>
            <p>{pagination?.total || 0} rezultate găsite</p>
          </div>
        </div>

        {loading ? (
          <LoadingCard text="Se încarcă anunțurile..." />
        ) : listings.length === 0 ? (
          <EmptyState
            title="Nu există rezultate pentru filtrele selectate."
            description="Încearcă să resetezi filtrele sau să alegi criterii mai puțin restrictive."
          />
        ) : (
          <>
            <div className="cards-grid">
              {listings.map((listing) => (
                <CarCard
                  key={listing.id}
                  listing={listing}
                  showFavoriteButton={isAuthenticated}
                  isFavorite={favoriteIds.includes(listing.id)}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn--ghost"
                  onClick={() => goToPage(pagination.page - 1)}
                  disabled={!pagination.hasPrevPage}
                >
                  Anterior
                </button>

                <span className="pagination__info">
                  Pagina {pagination.page} din {pagination.totalPages}
                </span>

                <button
                  className="btn btn--ghost"
                  onClick={() => goToPage(pagination.page + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  Următor
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}