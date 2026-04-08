import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/format';
import ImageWithFallback from './ImageWithFallback';

export default function CarCard({
  listing,
  onFavoriteToggle,
  isFavorite = false,
  showFavoriteButton = false
}) {
  return (
    <article className={`car-card ${listing.isSold ? 'car-card--sold' : ''}`}>
      <Link to={`/anunturi/${listing.id}`} className="car-card__link" aria-label={listing.title}>
        <div className="car-card__image-wrap">
          {listing.isSold && <span className="sold-badge">Vândut</span>}
          <ImageWithFallback
            src={listing.featuredImage}
            alt={listing.title}
            className="car-card__image"
          />
        </div>

        <div className="car-card__content">
          <div className="car-card__top">
            <h3>{listing.title}</h3>
            <span className="price">{formatPrice(listing.price)}</span>
          </div>

          <p className="car-card__meta">
            {listing.year} • {listing.mileage.toLocaleString('ro-RO')} km • {listing.fuelType} • {listing.transmission}
          </p>

          <p className="car-card__meta">{listing.locationCity}</p>
        </div>
      </Link>

      <div className="car-card__actions">
        <Link className="btn btn--ghost" to={`/anunturi/${listing.id}`}>
          Vezi detalii
        </Link>

        {showFavoriteButton && !listing.isSold && (
          <button
            type="button"
            className={`btn ${isFavorite ? '' : 'btn--ghost'}`}
            onClick={() => onFavoriteToggle?.(listing.id)}
          >
            {isFavorite ? 'În favorite' : 'Adaugă la favorite'}
          </button>
        )}
      </div>
    </article>
  );
}