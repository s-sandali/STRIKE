import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, ShoppingCart, User } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">SNIKEI</Link>
        <div className="navbar-links">
          <Link to="/products">Categories</Link>
          <Link to="/products">Shop</Link>
          <Link to="/about">About</Link>
        </div>
        <div className="navbar-actions">
          <button className="navbar-icon-btn">
            <Search size={20} />
          </button>

          <Link to="/cart" className="navbar-icon-btn navbar-cart-btn">
            <ShoppingCart size={20} />
            <span className="cart-badge">0</span>
          </Link>

          {isAuthenticated ? (
            <div className="navbar-profile">
              <Link to="/profile" className="navbar-icon-btn">
                <User size={20} />
              </Link>
              <button onClick={handleLogout} className="btn-link logout-btn">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="navbar-icon-btn">
              <User size={20} />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
