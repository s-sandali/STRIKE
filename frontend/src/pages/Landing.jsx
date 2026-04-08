import { useState } from 'react';
import { Link } from 'react-router-dom';

const BRANDS = ['LOTTO', 'PUMA', 'VANS', 'NIKE', 'GUCCI', 'BATA', 'UMBRO', 'FILA'];

const BEST_SELLERS = [
  { id: 'mens-sprint', name: "Men's Sprint Sports Shoe", price: '$190.90', emoji: '👟' },
  { id: 'kids-hightop', name: "High-Top Kids' Sneakers", price: '$100.50', emoji: '👟' },
  { id: 'brown-formal', name: 'Brown Formal Shoes', price: '$250.90', emoji: '👞' },
];

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

      {/* ── Hero ───────────────────────────────────────── */}
      <section className="lp-hero">
        <div className="lp-hero-text">
          <span className="lp-eyebrow">New Arrivals 2025</span>
          <h1>Step Into<br />Comfort &amp; Style</h1>
          <p>
            Discover our finest collection of shoes, crafted for everyday comfort,
            high performance and modern fashion.
          </p>
          <div className="lp-hero-btns">
            <Link to="/products" className="btn lp-btn-orange">Shop Now</Link>
            <Link to="/products" className="btn lp-btn-ghost">Explore More</Link>
          </div>
        </div>
        <div className="lp-hero-visual">
          <div className="lp-discount-badge">70%<br /><span>OFF</span></div>
          <div className="lp-hero-shoe">👟</div>
        </div>
      </section>

      {/* ── Trust bar ──────────────────────────────────── */}
      <div className="lp-trust-bar">
        <div className="lp-trust-item"><span>🔒</span> Secure Payment</div>
        <div className="lp-trust-item"><span>🎧</span> 24/7 Support</div>
        <div className="lp-trust-item"><span>🚚</span> Fast Delivery</div>
        <div className="lp-trust-item"><span>↩️</span> Easy Returns</div>
      </div>

      {/* ── Brands ─────────────────────────────────────── */}
      <section className="lp-section">
        <h2 className="lp-section-title">Trusted By Top Brands</h2>
        <div className="lp-brands">
          {BRANDS.map((b) => (
            <span key={b} className="lp-brand">{b}</span>
          ))}
        </div>
      </section>

      {/* ── Best Sellers ───────────────────────────────── */}
      <section className="lp-section lp-bg-light">
        <h2 className="lp-section-title">Best Sellers</h2>
        <div className="lp-sellers-grid">
          {BEST_SELLERS.map((item) => (
            <div key={item.id} className="lp-seller-card">
              <div className="lp-seller-img">{item.emoji}</div>
              <h4>{item.name}</h4>
              <p className="lp-price">{item.price}</p>
              <Link to="/products" className="btn lp-btn-orange lp-btn-sm">Shop Now</Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Collections ────────────────────────────────── */}
      <section className="lp-section">
        <h2 className="lp-section-title">
          Bring stylish and comfortable<br />footwear to everyone.
        </h2>
        <div className="lp-tabs">
          {COLLECTIONS.map((c) => (
            <button
              key={c.id}
              className={`lp-tab ${activeTab === c.id ? 'lp-tab-active' : ''}`}
              onClick={() => setActiveTab(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="lp-collection-panel" style={{ background: activeCol.color }}>
          <div className="lp-collection-text">
            <h3>{activeCol.label}</h3>
            <ul>
              {activeCol.desc.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <Link to="/products" className="btn lp-btn-orange" style={{ marginTop: '1.5rem' }}>
              See All Products
            </Link>
          </div>
          <div className="lp-collection-img">{activeCol.emoji}</div>
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
