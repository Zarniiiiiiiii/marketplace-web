import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="logo">AutoMarket</Link>

        <nav className="nav">
          <NavLink to="/">Acasă</NavLink>
          <NavLink to="/anunturi">Anunțuri</NavLink>
          {isAuthenticated && <NavLink to="/profil">Profil</NavLink>}
          {isAuthenticated && <NavLink to="/anunturile-mele">Anunțurile mele</NavLink>}
          {isAuthenticated && <NavLink to="/favorite">Favorite</NavLink>}
          {isAuthenticated && <NavLink to="/adauga-anunt">Adaugă anunț</NavLink>}
          {isAdmin && <NavLink to="/admin">Admin</NavLink>}
        </nav>

        <div className="auth-actions">
          {isAuthenticated ? (
            <>
              <span className="welcome">Salut, {user.firstName}</span>
              <button className="btn btn--ghost" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="btn btn--ghost" to="/login">Login</Link>
              <Link className="btn" to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}