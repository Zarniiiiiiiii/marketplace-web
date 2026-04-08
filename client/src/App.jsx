import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import ListingsPage from './pages/ListingsPage';
import ListingDetailsPage from './pages/ListingDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AddListingPage from './pages/AddListingPage';
import EditListingPage from './pages/EditListingPage';
import FavoritesPage from './pages/FavoritesPage';
import MyListingsPage from './pages/MyListingsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/anunturi" element={<ListingsPage />} />
          <Route path="/anunturi/:id" element={<ListingDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/profil" element={<ProfilePage />} />
            <Route path="/adauga-anunt" element={<AddListingPage />} />
            <Route path="/editeaza-anunt/:id" element={<EditListingPage />} />
            <Route path="/favorite" element={<FavoritesPage />} />
            <Route path="/anunturile-mele" element={<MyListingsPage />} />
          </Route>

          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}