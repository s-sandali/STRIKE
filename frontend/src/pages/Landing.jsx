import { useState } from 'react';
import { Link } from 'react-router-dom';
import shoe1 from '../assets/shoe1.jpg';
import shoe2 from '../assets/shoe2.jpg';
import shoe3 from '../assets/shoe3.jpg';
import shoe4 from '../assets/shoe4.jpg';
import { Recycle, ShieldCheck, Truck, Globe } from 'lucide-react';




const COLLECTIONS = [
  {
    id: 'sports',
    label: 'Sports Collection',
    desc: [
      'Performance-driven footwear for every sport.',
      'Stay safe with shoes built for durability.',
      'Designed for athletes, made for champions.',
      'Boost your performance with our sports collection.',
    ],
    emoji: '👟',
    color: '#fff4f0',
  },
  {
    id: 'luxury',
    label: 'Luxury Collection',
    desc: [
      'Premium materials, exquisite craftsmanship.',
      'Handcrafted details for the discerning eye.',
      'Elevate every outfit with timeless elegance.',
      'Experience footwear at its finest.',
    ],
    emoji: '👠',
    color: '#f9f5ff',
  },
  {
    id: 'kids',
    label: 'Kids Collection',
    desc: [
      'Fun designs that kids absolutely love.',
      'Durable construction for active little ones.',
      'Lightweight and easy to put on.',
      'Sizes for every growing foot.',
    ],
    emoji: '👟',
    color: '#f0fff4',
  },
  {
    id: 'casual',
    label: 'Casual Collection',
    desc: [
      'Everyday comfort meets modern style.',
      'Versatile designs for any occasion.',
      'All-day support you can feel.',
      'Look great without trying too hard.',
    ],
    emoji: '🥿',
    color: '#fffbeb',
  },
];

const FEATURES = [
  { id: 'lightweight', icon: '🪶', label: 'Lightweight', desc: 'Feather-light construction for all-day comfort' },
  { id: 'durable', icon: '🏗️', label: 'Durable Build', desc: 'Built to last through any adventure' },
  { id: 'breathable', icon: '💨', label: 'Breathable Design', desc: 'Advanced airflow keeps feet fresh all day' },
  { id: 'style', icon: '✨', label: 'Modern Style', desc: 'Contemporary designs for every occasion' },
  { id: 'fit', icon: '👟', label: 'Perfect Fit', desc: 'Ergonomic design for your natural foot shape' },
  { id: 'care', icon: '🧹', label: 'Easy Care', desc: 'Simple maintenance for long-lasting looks' },
];

const POPULAR = [
  { id: 'pop-sports', cat: 'Sports', bg: '#dbeafe', emoji: '👟' },
  { id: 'pop-casual', cat: 'Casual', bg: '#fef3c7', emoji: '🥿' },
  { id: 'pop-kids', cat: 'Kids', bg: '#dcfce7', emoji: '👟' },
];

const TESTIMONIALS = [
  {
    id: 'anna',
    name: 'Anna de Forsi',
    role: 'Runner',
    stars: 5,
    text: 'I absolutely love these shoes! They are stylish, comfortable, and perfect for my everyday runs. The quality is excellent and they make every step feel amazing.',
  },
  {
    id: 'ali',
    name: 'Ali Mansour',
    role: 'Designer',
    stars: 5,
    text: 'Stylish shoes are a game changer. They fit perfectly, feel incredibly supportive, and are durable enough for my active lifestyle. Highly recommend!',
  },
  {
    id: 'omar',
    name: 'Omar Al-Hakem',
    role: 'Designer',
    stars: 5,
    text: 'These shoes combine fashion and comfort flawlessly. Lightweight, breathable, and high quality — they\'re my absolute favourite pair.',
  },
];

export default function Landing() {
  const [activeTab, setActiveTab] = useState('sports');
  const activeCol = COLLECTIONS.find((c) => c.id === activeTab);

  return (
    <div className="landing">

      {/* ── New Hero ──────────────────────────────────── */}
      <section className="new-hero-section">
        <div className="new-hero-bg">
          <img src={shoe2} alt="Shoes background" />
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
              <img src={shoe1} alt="New Arrival" />
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
          <div className="promo-card" style={{ backgroundImage: `url(${shoe3})` }}>
            <div className="promo-badge">20% OFF</div>
            <div className="promo-content">
              <h2>Explore All<br />Formal Shoes</h2>
              <Link to="/products" className="promo-btn">
                Shop Now <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </Link>
            </div>
          </div>
          <div className="promo-card" style={{ backgroundImage: `url(${shoe4})` }}>
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

      {/* ── Features ───────────────────────────────────── */}
      <section className="lp-section lp-bg-light">
        <h2 className="lp-section-title">Shoes That Do More Than Just<br />Look Good</h2>
        <p className="lp-section-sub">
          Our shoes are carefully crafted to give you consistent comfort, durability
          and support for every step you take.
        </p>
        <div className="lp-features-grid">
          {FEATURES.map((f) => (
            <div key={f.id} className="lp-feature-card">
              <div className="lp-feature-icon">{f.icon}</div>
              <h4>{f.label}</h4>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Popular Products ───────────────────────────── */}
      <section className="lp-section">
        <h2 className="lp-section-title">Popular Product</h2>
        <p className="lp-section-sub">
          Discover the footwear that has captured hearts, combining modern style
          with everyday reliability.
        </p>
        <div className="lp-popular-grid">
          {POPULAR.map((item) => (
            <div key={item.id} className="lp-popular-card" style={{ background: item.bg }}>
              <div className="lp-popular-shoe">{item.emoji}</div>
              <div className="lp-popular-footer">
                <strong>{item.cat}</strong>
                <Link to="/products" className="btn lp-btn-orange lp-btn-sm">Shop Now</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────── */}
      <section className="lp-section lp-bg-light">
        <h2 className="lp-section-title">What Our Customers Say</h2>
        <div className="lp-testimonials-grid">
          {TESTIMONIALS.map((t) => (
            <div key={t.id} className="lp-testimonial-card">
              <div className="lp-stars">{'★'.repeat(t.stars)}</div>
              <p>"{t.text}"</p>
              <div className="lp-author">
                <div className="lp-avatar">{t.name[0]}</div>
                <div>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Newsletter ─────────────────────────────────── */}
      <section className="lp-newsletter">
        <h2>Don't Sleep on the Next Drop</h2>
        <p>
          Sign up to get exclusive updates on all shoes available when they drop.
        </p>
        <form className="lp-newsletter-form" onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="Enter your email address" />
          <button type="submit" className="btn lp-btn-orange">Subscribe</button>
        </form>
      </section>

    </div>
  );
}
