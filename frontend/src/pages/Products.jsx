import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(null);
  const [feedback, setFeedback] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/products/')
      .then((res) => setProducts(res.data))
      .catch(() => setError('Failed to load products.'))
      .finally(() => setLoading(false));
  }, []);

  const addToCart = async (productId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setAdding(productId);
    try {
      await api.post('/cart/items', { product_id: productId, quantity: 1 });
      setFeedback('Added to cart!');
    } catch (err) {
      setFeedback(err.response?.data?.detail || 'Failed to add to cart.');
    } finally {
      setAdding(null);
      setTimeout(() => setFeedback(''), 2500);
    }
  };

  if (loading) return <p className="status-text">Loading products...</p>;
  if (error) return <p className="error" style={{ textAlign: 'center', marginTop: '2rem' }}>{error}</p>;

  return (
    <div>
      <h2>Products</h2>
      {feedback && <p className="feedback">{feedback}</p>}
      {products.length === 0 ? (
        <p className="status-text">No products available yet.</p>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <div key={p.id} className="product-card">
              <h3>{p.name}</h3>
              <p className="price">${Number(p.price).toFixed(2)}</p>
              <button
                className="btn btn-primary"
                onClick={() => addToCart(p.id)}
                disabled={adding === p.id}
              >
                {adding === p.id ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
