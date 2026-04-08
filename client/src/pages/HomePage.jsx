import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import http from '../api/http';
import CarCard from '../components/CarCard';
import LoadingCard from '../components/LoadingCard';

export default function HomePage() {
  const [recentListings, setRecentListings] = useState([]);
  const [premiumListings, setPremiumListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      http.get('/listings?sort=latest&pageSize=4'),
      http.get('/listings?sort=price_desc&pageSize=4')
    ])
      .then(([recentResponse, premiumResponse]) => {
        setRecentListings(recentResponse.data.listings);
        setPremiumListings(premiumResponse.data.listings);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="hero">
        <div className="container hero__grid">
          <div>
            <span className="badge">Anunțuri auto verificate</span>
            <h1>Găsește rapid mașina potrivită sau publică propriul anunț.</h1>
            <p>
              AutoMarket îți oferă anunțuri auto, filtrare rapidă, favorite, recomandări și administrare simplă,
              într-o interfață modernă și ușor de folosit.
            </p>
            <div className="hero__actions">
              <Link className="btn" to="/anunturi">Vezi anunțurile</Link>
              <Link className="btn btn--ghost" to="/adauga-anunt">Publică un anunț</Link>
            </div>
          </div>

          <div className="hero__card card">
            <h3>Ce găsești în platformă</h3>
            <ul>
              <li>filtre după marcă, model, preț și oraș</li>
              <li>favorite și recomandări similare</li>
              <li>upload imagini și administrare anunțuri</li>
              <li>moderare din panoul admin</li>
              <li>profil utilizator și istoric anunțuri</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container section__header">
          <div>
            <h2>Anunțuri recente</h2>
            <p>Ultimele anunțuri aprobate din platformă.</p>
          </div>
          <Link to="/anunturi">Vezi toate</Link>
        </div>

        <div className="container">
          {loading ? (
            <LoadingCard text="Se încarcă anunțurile..." />
          ) : (
            <div className="cards-grid">
              {recentListings.map((listing) => (
                <CarCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section section--topless">
        <div className="container section__header">
          <div>
            <h2>Selecție premium</h2>
            <p>Anunțuri cu preț mai ridicat, utile pentru testarea filtrării și sortării.</p>
          </div>
          <Link to="/anunturi">Explorează</Link>
        </div>

        <div className="container">
          {loading ? (
            <LoadingCard text="Se încarcă selecția premium..." />
          ) : (
            <div className="cards-grid">
              {premiumListings.map((listing) => (
                <CarCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}