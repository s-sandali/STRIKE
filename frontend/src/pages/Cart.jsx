import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkingOut, setCheckingOut] = useState(false);
  const [orderDone, setOrderDone] = useState(false);
  
  const { isAuthenticated } = useAuth();
  const { refreshCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchCart();
  }, [isAuthenticated, navigate]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await api.get('/cart/');
      setCart(res.data);
    } catch {
      setError('Failed to load cart.');
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await api.delete(`/cart/items/${itemId}`);
      fetchCart();
      refreshCart();
    } catch {
      setError('Failed to remove item.');
    }
  };

  const checkout = async () => {
    setCheckingOut(true);
    setError('');
    try {
      await api.post('/checkout/');
      setOrderDone(true);
      refreshCart();
    } catch (err) {
      setError(err.response?.data?.detail || 'Checkout failed.');
    } finally {
      setCheckingOut(false);
    }
  };

  const formatPrice = (priceStr) => {
    const num = Number(priceStr);
    return isNaN(num) ? priceStr : `LKR ${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (loading) return <div className="cart-page-wrapper"><div className="status-text">Loading your cart...</div></div>;

  if (orderDone) {
    return (
      <div className="cart-page-wrapper center-message">
        <div className="order-success-card">
          <ShoppingBag size={48} color="#10b981" />
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for choosing STRIKER. Your items will be shipped shortly.</p>
          <button className="btn-black" onClick={() => navigate('/products')}>
            Continue Shopping <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  const items = cart?.items ?? [];
  const total = items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);

  return (
    <div className="cart-page-wrapper">
      <div className="cart-header">
        <h1>Your Cart</h1>
      </div>

      {error && <p className="error-msg">{error}</p>}

      {items.length === 0 ? (
        <div className="empty-cart-message">
          <ShoppingBag size={48} strokeWidth={1} color="#aaa" />
          <p>Your shopping cart is currently empty.</p>
          <Link to="/products" className="btn-black">
            Start Exploring
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Cart Items List */}
          <div className="cart-items-section">
            <h3 className="section-title">Items ({items.length})</h3>
            <div className="cart-items-list">
              {items.map((item) => (
                <div key={item.id} className="cart-item-card">
                  <div className="cart-item-image">
                    <img src={item.product.image_url} alt={item.product.name} />
                  </div>
                  <div className="cart-item-details">
                    <Link to={`/products/${item.product.id}`} className="cart-item-name">
                      {item.product.name}
                    </Link>
                    <div className="cart-item-meta">
                      Size: Standard | Qty: {item.quantity}
                    </div>
                    <div className="cart-item-price">
                      {formatPrice(Number(item.product.price) * item.quantity)}
                    </div>
                  </div>
                  <div className="cart-item-actions">
                    <button className="remove-btn" onClick={() => removeItem(item.id)} title="Remove Item">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="cart-summary-section">
            <h3 className="section-title">Order Summary</h3>
            <div className="summary-box">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <hr className="summary-divider" />
              <div className="summary-row total-row">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <button 
                className="checkout-btn" 
                onClick={checkout}
                disabled={checkingOut}
              >
                {checkingOut ? 'Processing...' : 'Proceed to Checkout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
