import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="page-center">
      <h1>Welcome to ShopApp</h1>
      <p>A simple e-commerce store built with FastAPI + React.</p>
      <div className="button-group">
        <Link to="/products" className="btn btn-primary">Browse Products</Link>
        {!isAuthenticated && (
          <>
            <Link to="/login" className="btn btn-secondary">Login</Link>
            <Link to="/register" className="btn btn-secondary">Register</Link>
          </>
        )}
      </div>
    </div>
  );
}
