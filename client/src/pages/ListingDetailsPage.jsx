import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import http from '../api/http';
import { useAuth } from '../contexts/AuthContext';
import { formatDate, formatPrice } from '../utils/format';
import ImageWithFallback from '../components/ImageWithFallback';
import LoadingCard from '../components/LoadingCard';
import CarCard from '../components/CarCard';
import { showToast } from '../utils/toast';

export default function ListingDetailsPage() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [listing, setListing] = useState(null);
  const [similarListings, setSimilarListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    Promise.all([
      http.get(`/listings/${id}`),
      http.get(`/listings/${id}/similar`)
    ])
      .then(([listingResponse, similarResponse]) => {
        setListing(listingResponse.data.listing);
        setSimilarListings(similarResponse.data.listings);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsFavorite(false);
      return;
    }

    http.get('/favorites').then((response) => {
      const favoriteIds = response.data.favorites.map((item) => item.listing.id);
      setIsFavorite(favoriteIds.includes(Number(id)));
    });
  }, [id, isAuthenticated]);

  async function handleFavoriteToggle() {
    if (!isAuthenticated) return;

    const response = await http.post(`/favorites/${id}`);
    setIsFavorite(response.data.isFavorite);

    showToast(
      response.data.isFavorite
        ? 'Anunțul a fost adăugat la favorite.'
        : 'Anunțul a fost scos din favorite.'
    );
  }

  if (loading) return <div className="container section"><LoadingCard text="Se încarcă detaliile..." /></div>;
  if (!listing) return <div className="container section"><div className="card">Anunțul nu a fost găsit.</div></div>;

  return (
    <div className="container section">
      <div className="details-layout">
        <section>
          <div className="details-image-wrap">
            {listing.isSold && <span className="sold-badge sold-badge--large">Vândut</span>}
            <ImageWithFallback src={listing.featuredImage} alt={listing.title} className="details-image" />
          </div>

          <div className="gallery-grid">
            {listing.gallery?.map((image) => (
              <ImageWithFallback key={image} src={image} alt={listing.title} className="gallery-thumb" />
            ))}
          </div>
        </section>

        <aside className="details-sidebar">
          <div className="card">
            <h1>{listing.title}</h1>
            <p className="price large">{formatPrice(listing.price)}</p>
            <p>{listing.description}</p>

            {isAuthenticated && !listing.isSold && (
              <button className={`btn ${isFavorite ? '' : 'btn--ghost'}`} onClick={handleFavoriteToggle}>
                {isFavorite ? 'Scoate din favorite' : 'Adaugă la favorite'}
              </button>
            )}
          </div>

          <div className="card specs-grid">
            <div><strong>Marcă</strong><span>{listing.brand}</span></div>
            <div><strong>Model</strong><span>{listing.model}</span></div>
            <div><strong>An</strong><span>{listing.year}</span></div>
            <div><strong>Kilometri</strong><span>{listing.mileage.toLocaleString('ro-RO')} km</span></div>
            <div><strong>Combustibil</strong><span>{listing.fuelType}</span></div>
            <div><strong>Transmisie</strong><span>{listing.transmission}</span></div>
            <div><strong>Culoare</strong><span>{listing.color}</span></div>
            <div><strong>Motor</strong><span>{listing.engine}</span></div>
            <div><strong>Cai putere</strong><span>{listing.horsepower}</span></div>
            <div><strong>Oraș</strong><span>{listing.locationCity}</span></div>
          </div>

          <div className="card">
            <h3>Date de contact</h3>
            <p><strong>Nume:</strong> {listing.contactName || `${listing.owner.firstName} ${listing.owner.lastName}`}</p>
            <p><strong>Email:</strong> {listing.contactEmail || listing.owner.email}</p>
            <p><strong>Telefon:</strong> {listing.contactPhone || listing.owner.phone || 'Telefon indisponibil'}</p>
            <p><strong>Oraș:</strong> {listing.locationCity}</p>
            <p><strong>Publicat la:</strong> {formatDate(listing.createdAt)}</p>

            {!listing.isSold && (
              <div className="contact-actions">
                <a className="btn" href={`tel:${listing.contactPhone || listing.owner.phone || ''}`}>
                  Sună acum
                </a>
                <a className="btn btn--ghost" href={`mailto:${listing.contactEmail || listing.owner.email || ''}`}>
                  Trimite email
                </a>
              </div>
            )}
          </div>
        </aside>
      </div>

      <section className="section section--topless">
        <div className="section__header compact">
          <div>
            <h2>Anunțuri similare</h2>
            <p>Recomandări după marcă, model și interval de preț.</p>
          </div>
        </div>

        {similarListings.length === 0 ? (
          <div className="card">Nu există încă anunțuri similare.</div>
        ) : (
          <div className="cards-grid">
            {similarListings.map((similarListing) => (
              <CarCard key={similarListing.id} listing={similarListing} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}