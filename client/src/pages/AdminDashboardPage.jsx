import { useEffect, useState } from 'react';
import http from '../api/http';
import { formatDate, formatPrice } from '../utils/format';
import LoadingCard from '../components/LoadingCard';
import ImageWithFallback from '../components/ImageWithFallback';
import { showToast } from '../utils/toast';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [listings, setListings] = useState([]);
  const [users, setUsers] = useState([]);
  const [userListings, setUserListings] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [listingFilters, setListingFilters] = useState({
    search: '',
    status: 'PENDING',
    ownerId: ''
  });

  const [userSearch, setUserSearch] = useState('');
  const [rejectReasons, setRejectReasons] = useState({});

  async function loadStats() {
    const response = await http.get('/admin/stats');
    setStats(response.data.stats);
  }

  async function loadListings() {
    const params = new URLSearchParams();
    if (listingFilters.search) params.set('search', listingFilters.search);
    if (listingFilters.status) params.set('status', listingFilters.status);
    if (listingFilters.ownerId) params.set('ownerId', listingFilters.ownerId);

    const response = await http.get(`/admin/listings?${params.toString()}`);
    setListings(response.data.listings);
  }

  async function loadUsers() {
    const params = new URLSearchParams();
    if (userSearch) params.set('search', userSearch);

    const response = await http.get(`/admin/users?${params.toString()}`);
    setUsers(response.data.users);
  }

  async function loadAll() {
    setLoading(true);
    await Promise.all([loadStats(), loadListings(), loadUsers()]);
    setLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    loadListings();
  }, [listingFilters]);

  useEffect(() => {
    loadUsers();
  }, [userSearch]);

  async function handleApprove(id) {
    await http.patch(`/admin/listings/${id}/approve`);
    showToast('Anunțul a fost aprobat.');
    await Promise.all([loadListings(), loadStats()]);
  }

  async function handleReject(id) {
    const reason = (rejectReasons[id] || '').trim();

    if (reason.length < 5) {
      showToast('Introdu un motiv de respingere de minim 5 caractere.', 'error');
      return;
    }

    await http.patch(`/admin/listings/${id}/reject`, { reason });
    showToast('Anunțul a fost respins.');
    setRejectReasons((prev) => ({ ...prev, [id]: '' }));
    await Promise.all([loadListings(), loadStats()]);
  }

  async function handleViewUserListings(user) {
    const response = await http.get(`/admin/users/${user.id}/listings`);
    setSelectedUser(user);
    setUserListings(response.data.listings);
  }

  function handleListingFilterChange(event) {
    const { name, value } = event.target;
    setListingFilters((prev) => ({ ...prev, [name]: value }));
  }

  if (loading) {
    return (
      <div className="container section">
        <LoadingCard text="Se încarcă panoul admin..." />
      </div>
    );
  }

  return (
    <div className="container section admin-space">
      <div className="section__header compact">
        <div>
          <h1>Panou administrare</h1>
          <p>Moderare anunțuri, gestionare utilizatori și statistici utile.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="card stat-card"><strong>{stats.usersCount}</strong><span>Utilizatori</span></div>
        <div className="card stat-card"><strong>{stats.listingsCount}</strong><span>Anunțuri total</span></div>
        <div className="card stat-card"><strong>{stats.pendingCount}</strong><span>Pending</span></div>
        <div className="card stat-card"><strong>{stats.approvedCount}</strong><span>Aprobate</span></div>
        <div className="card stat-card"><strong>{stats.rejectedCount}</strong><span>Respinse</span></div>
      </div>

      <div className="admin-stats-panels">
        <div className="table-card">
          <h2>Top mărci</h2>
          <div className="mini-stats-list">
            {stats.listingsByBrand.map((item) => (
              <div key={item.label} className="mini-stat-row">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="table-card">
          <h2>Top orașe</h2>
          <div className="mini-stats-list">
            {stats.listingsByCity.map((item) => (
              <div key={item.label} className="mini-stat-row">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="table-card">
        <div className="section__header compact">
          <div>
            <h2>Moderare anunțuri</h2>
            <p>Poți filtra rapid anunțurile după status sau căutare.</p>
          </div>
        </div>

        <div className="admin-filters">
          <input
            name="search"
            placeholder="Caută după titlu, user sau email"
            value={listingFilters.search}
            onChange={handleListingFilterChange}
          />

          <select
            name="status"
            value={listingFilters.status}
            onChange={handleListingFilterChange}
          >
            <option value="">Toate statusurile</option>
            <option value="PENDING">Doar pending</option>
            <option value="APPROVED">Doar aprobate</option>
            <option value="REJECTED">Doar respinse</option>
          </select>

          <button
            className="btn btn--ghost"
            onClick={() => setListingFilters({ search: '', status: 'PENDING', ownerId: '' })}
          >
            Reset
          </button>
        </div>

        <div className="admin-listings-grid">
          {listings.map((listing) => (
            <article key={listing.id} className="admin-listing-card">
              <ImageWithFallback
                src={listing.featuredImage}
                alt={listing.title}
                className="admin-listing-image"
              />

              <div className="admin-listing-body">
                <h3>{listing.title}</h3>
                <p className="price">{formatPrice(listing.price)}</p>
                <p>{listing.year} • {listing.mileage.toLocaleString('ro-RO')} km • {listing.locationCity}</p>
                <p><strong>Owner:</strong> {listing.owner.firstName} {listing.owner.lastName}</p>
                <p><strong>Email:</strong> {listing.owner.email}</p>
                <p><strong>Status:</strong> {listing.status}</p>
                <p><strong>Publicat:</strong> {listing.isPublished ? 'Da' : 'Nu'}</p>

                {listing.rejectionReason && (
                  <div className="admin-rejection-box">
                    <strong>Motiv respingere:</strong>
                    <span>{listing.rejectionReason}</span>
                  </div>
                )}

                <div className="table-actions">
                  <a className="btn btn--ghost" href={`/anunturi/${listing.id}`} target="_blank" rel="noreferrer">
                    Vezi anunțul
                  </a>

                  <button className="btn btn--ghost" onClick={() => handleApprove(listing.id)}>
                    Aprobă
                  </button>
                </div>

                <div className="admin-reject-row">
                  <input
                    type="text"
                    placeholder="Motivul respingerii"
                    value={rejectReasons[listing.id] || ''}
                    onChange={(event) =>
                      setRejectReasons((prev) => ({
                        ...prev,
                        [listing.id]: event.target.value
                      }))
                    }
                  />
                  <button className="btn btn--ghost" onClick={() => handleReject(listing.id)}>
                    Respinge
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="table-card">
        <div className="section__header compact">
          <div>
            <h2>Utilizatori</h2>
            <p>Caută rapid și vezi anunțurile fiecărui utilizator.</p>
          </div>
        </div>

        <div className="admin-filters">
          <input
            placeholder="Caută după nume, email sau oraș"
            value={userSearch}
            onChange={(event) => setUserSearch(event.target.value)}
          />
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Nume</th>
              <th>Email</th>
              <th>Oraș</th>
              <th>Rol</th>
              <th>Anunțuri</th>
              <th>Favorite</th>
              <th>Creat la</th>
              <th>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.city || '-'}</td>
                <td>{user.role}</td>
                <td>{user._count.listings}</td>
                <td>{user._count.favorites}</td>
                <td>{formatDate(user.createdAt)}</td>
                <td>
                  <button className="btn btn--ghost" onClick={() => handleViewUserListings(user)}>
                    Vezi anunțuri
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div className="table-card">
          <div className="section__header compact">
            <div>
              <h2>Anunțurile utilizatorului</h2>
              <p>{selectedUser.firstName} {selectedUser.lastName} • {selectedUser.email}</p>
            </div>
          </div>

          {userListings.length === 0 ? (
            <div className="card">Utilizatorul nu are anunțuri.</div>
          ) : (
            <div className="admin-listings-grid">
              {userListings.map((listing) => (
                <article key={listing.id} className="admin-listing-card">
                  <ImageWithFallback
                    src={listing.featuredImage}
                    alt={listing.title}
                    className="admin-listing-image"
                  />

                  <div className="admin-listing-body">
                    <h3>{listing.title}</h3>
                    <p className="price">{formatPrice(listing.price)}</p>
                    <p>{listing.year} • {listing.locationCity}</p>
                    <p><strong>Status:</strong> {listing.status}</p>
                    <p><strong>Publicat:</strong> {listing.isPublished ? 'Da' : 'Nu'}</p>
                    <p><strong>Vândut:</strong> {listing.isSold ? 'Da' : 'Nu'}</p>

                    <div className="table-actions">
                      <a className="btn btn--ghost" href={`/anunturi/${listing.id}`} target="_blank" rel="noreferrer">
                        Vezi anunțul
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}