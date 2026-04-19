import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

import { Recycle, ShieldCheck, Truck, Globe, Star } from 'lucide-react';
import PromoCarousel from '../components/PromoCarousel';
import ReviewsCarousel from '../components/ReviewsCarousel';


export default function Landing() {
  const [bestSellers, setBestSellers] = useState([]);
  const [activeTab, setActiveTab] = useState('sports');

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await api.get('/products');
        setBestSellers(response.data.slice(0, 8));
      } catch (error) {
        console.error('Error fetching best sellers:', error);
      }
    }
    fetchProducts();
  }, []);

  const formatPrice = (priceStr) => {
    const num = Number(priceStr);
    return isNaN(num) ? priceStr : `LKR ${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="landing">

      {/* ── New Hero ──────────────────────────────────── */}
      <section className="new-hero-section">
        <div className="new-hero-bg">
          <img src="https://i.pinimg.com/1200x/63/2b/19/632b191b47cd866eba79174ab44ab100.jpg" alt="Shoes background" />
        </div>
        <div className="new-hero-overlay"></div>
        <div className="new-hero-container">
          <div className="new-hero-content">
            <h1 className="new-hero-title">
              Explore<br />Premium<br />Shoes
            </h1>
            <div className="new-hero-actions">
              <Link to="/products" className="new-hero-btn btn-white">
                Shop Now <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </Link>
              <Link to="/products" className="new-hero-btn btn-outline">
                Categories <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </Link>
            </div>
          </div>
          <div className="new-hero-card">
            <div className="new-hero-card-img">
              <img src="https://i.pinimg.com/1200x/44/88/65/448865f61a5d219fb8764f432a6646b9.jpg" alt="New Arrival" />
            </div>
            <div className="new-hero-card-footer">
              <Link to="/products">
                Explore New Arrivals <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Banner ────────────────────────────── */}
      <section className="features-banner">
        <div className="features-banner-container">
          <div className="feature-item">
            <Recycle size={32} strokeWidth={1.5} />
            <h3>Sustainable Materials</h3>
            <p>We believe great style shouldn't come at the planet's expense.</p>
          </div>
          <div className="feature-item">
            <ShieldCheck size={32} strokeWidth={1.5} />
            <h3>Warranty Included</h3>
            <p>Every pair comes with a hassle-free 6-month warranty</p>
          </div>
          <div className="feature-item">
            <Truck size={32} strokeWidth={1.5} />
            <h3>Delivery &amp; Shipping</h3>
            <p>Your shoes will be dispatched within 1-2 business days</p>
          </div>
          <div className="feature-item">
            <Globe size={32} strokeWidth={1.5} />
            <h3>Eco-Friendly Fabrics</h3>
            <p>Crafted with sustainability in mind, our shoes feature eco-friendly fabrics</p>
          </div>
        </div>
      </section>




      {/* ── Promo Cards ────────────────────────────────── */}
      <section className="promo-cards-section">
        <div className="promo-cards-container">
          <div className="promo-card" style={{ backgroundImage: `url('https://i.pinimg.com/736x/7e/b6/af/7eb6af38dae288b15b88a4abf350bdfb.jpg')` }}>
            <div className="promo-badge">20% OFF</div>
            <div className="promo-content">
              <h2>Explore All<br />Formal Shoes</h2>
              <Link to="/products" className="promo-btn">
                Shop Now <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </Link>
            </div>
          </div>
          <div className="promo-card" style={{ backgroundImage: `url('https://media.fashionnetwork.com/cdn-cgi/image/fit=cover,width=440,height=248,format=auto/m/6dd2/8cfc/30d5/77d2/3067/38c3/e1cf/b84b/5644/3392/3392.jpg')` }}>
            <div className="promo-badge">25% OFF</div>
            <div className="promo-content">
              <h2>Grab The Latest<br />Running Shoes</h2>
              <Link to="/products" className="promo-btn">
                Shop Now <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>



      {/* ── Best Sellers ───────────────────────────────── */}
      <section className="best-sellers-section">
        <h2 className="section-title">Best Sellers</h2>
        <div className="best-sellers-grid">
          {bestSellers.map((item) => (
            <Link key={item.id} to={`/products/${item.id}`} className="bs-card" style={{ textDecoration: 'none' }}>
              <div className="bs-card-img">
                <img src={item.image_url} alt={item.name} />
              </div>
              <div className="bs-card-body">
                <div className="bs-card-header">
                  <h3>{item.name}</h3>
                  <div className="bs-rating">
                    <Star size={14} fill="#f97316" color="#f97316" />
                    <span>({Number(item.rating || 0).toFixed(1)})</span>
                  </div>
                </div>
                <div className="bs-card-price">
                  <span className="current-price">{formatPrice(item.price)}</span>
                  {item.old_price && <span className="old-price">{formatPrice(item.old_price)}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Promo Carousel ───────────────────────────────── */}
      <PromoCarousel />

      {/* ── Reviews Carousel ───────────────────────────────── */}
      <ReviewsCarousel />

    </div>
  );
}
