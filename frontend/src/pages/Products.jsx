import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Star, ChevronUp, ChevronDown, CheckCircle2, Circle } from 'lucide-react';
import api from '../api/axios';

const CATEGORIES = [
  'All Products',
  'Sneakers',
  'Boots',
  'Formal',
  'Loafers',
  'Heels',
  'Flats',
  'Beach Sandals',
  'Ballet Flats',
];

const PRICE_RANGES = [
  { id: 'all', label: 'All Prices' },
  { id: '1', label: 'LKR 0 - LKR 10,000', min: 0, max: 10000 },
  { id: '2', label: 'LKR 10,001 - LKR 15,000', min: 10001, max: 15000 },
  { id: '3', label: 'LKR 15,001 - LKR 20,000', min: 15001, max: 20000 },
  { id: '4', label: 'LKR 20,001+', min: 20001, max: 999999999 },
];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState('All Products');
  const [priceRange, setPriceRange] = useState('all');

  const [catOpen, setCatOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);

  useEffect(() => {
    api.get('/products/')
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error('Failed to load products:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // 1. Category Filter
      let catMatch = category === 'All Products';
      if (!catMatch) {
        const search = category.toLowerCase().replace(/s$/, ''); // 'Sneakers' -> 'sneaker'
        const prodType = (p.product_type || '').toLowerCase();
        const name = (p.name || '').toLowerCase();

        if (category === 'Sports Shoe') {
          catMatch = prodType.includes('sports') || name.includes('sports');
        } else if (category === 'High Neck') {
          catMatch = name.includes('high neck');
        } else {
          catMatch = prodType.includes(search) || name.includes(search);
        }
      }

      // 2. Price Filter
      let priceMatch = true;
      if (priceRange !== 'all') {
        const range = PRICE_RANGES.find(r => r.id === priceRange);
        if (range) {
          const price = Number(p.price);
          priceMatch = price >= range.min && price <= range.max;
        }
      }

      return catMatch && priceMatch;
    });
  }, [products, category, priceRange]);

  const formatPrice = (priceStr) => {
    const num = Number(priceStr);
    return isNaN(num) ? priceStr : `LKR ${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="shop-page-wrapper">
      <div className="shop-header">
        <h1>{category === 'All Products' ? 'Explore Our Shop' : category}</h1>
      </div>

      <div className="shop-layout">
        {/* SIDEBAR */}
        <aside className="shop-sidebar">
          {/* Categories */}
          <div className="sidebar-group">
            <div className="sidebar-group-header" onClick={() => setCatOpen(!catOpen)}>
              <h3>Categories</h3>
              {catOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
            {catOpen && (
              <ul className="sidebar-list">
                {CATEGORIES.map(c => (
                  <li
                    key={c}
                    className={category === c ? 'active' : ''}
                    onClick={() => setCategory(c)}
                  >
                    <span>{c}</span>
                    {category === c ? <CheckCircle2 size={16} fill="#111" color="#fff" /> : <Circle size={16} stroke="#ccc" />}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Price Ranges */}
          <div className="sidebar-group">
            <div className="sidebar-group-header" onClick={() => setPriceOpen(!priceOpen)}>
              <h3>Price Ranges</h3>
              {priceOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
            {priceOpen && (
              <ul className="sidebar-list">
                {PRICE_RANGES.map(r => (
                  <li
                    key={r.id}
                    className={priceRange === r.id ? 'active' : ''}
                    onClick={() => setPriceRange(r.id)}
                  >
                    <span>{r.label}</span>
                    {priceRange === r.id ? <CheckCircle2 size={16} fill="#111" color="#fff" /> : <Circle size={16} stroke="#ccc" />}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        {/* MAIN GRID */}
        <main className="shop-main">
          {filteredProducts.length === 0 ? (
            <div className="no-products-msg">No products found for this criteria.</div>
          ) : (
            <div className="shop-grid">
              {filteredProducts.map(p => (
                <Link key={p.id} to={`/products/${p.id}`} className="shop-card">
                  <div className="shop-card-img">
                    <img src={p.image_url} alt={p.name} />
                  </div>
                  <div className="shop-card-body">
                    <div className="shop-card-top">
                      <h4 className="shop-card-title">{p.name}</h4>
                      <div className="shop-card-rating">
                        <Star size={12} fill="#f97316" color="#f97316" />
                        <span>({Number(p.rating || 0).toFixed(1)})</span>
                      </div>
                    </div>
                    <div className="shop-card-price">
                      <span className="price-main">{formatPrice(p.price)}</span>
                      {p.old_price && <span className="price-old">{formatPrice(p.old_price)}</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
