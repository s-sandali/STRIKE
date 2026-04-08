import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star } from 'lucide-react';
import axios from 'axios';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('M');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await axios.get(`http://localhost:8000/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading product details...</div>;
  if (!product) return <div style={{ padding: '4rem', textAlign: 'center' }}>Product not found.</div>;

  const formatPrice = (priceStr) => {
    const num = Number(priceStr);
    return isNaN(num) ? priceStr : `LKR ${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const sizes = product.available_sizes ? product.available_sizes.split(',').map(s => s.trim()) : ['S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="product-details-container">
      <div className="product-top-section">
        {/* Left: Image */}
        <div className="product-image-box">
          <img src={product.image_url} alt={product.name} />
        </div>

        {/* Right: Info */}
        <div className="product-info-box">
          <div className="product-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill={i < Math.floor(Number(product.rating || 0)) ? "#f97316" : "transparent"} color="#f97316" />
              ))}
            </div>
            <span className="reviews-count">({product.reviews_count} reviews)</span>
          </div>

          <h1 className="product-title">{product.name}</h1>
          
          <div className="product-price-section">
            <span className="price-main">{formatPrice(product.price)}</span>
            {product.old_price && <span className="price-old">{formatPrice(product.old_price)}</span>}
          </div>

          <p className="product-warehouse-msg">
            We have this product in United States warehouse. If destination means you can receive the parcel faster and earlier than expected.
          </p>

          <div className="product-sizes">
            {sizes.map((s) => (
              <button 
                key={s} 
                className={`size-btn ${selectedSize === s ? 'active' : ''}`}
                onClick={() => setSelectedSize(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="product-actions">
            <input 
              type="number" 
              className="qty-input" 
              value={qty} 
              min={1} 
              onChange={(e) => setQty(e.target.value)} 
            />
            <button className="add-to-cart-btn">
              Add to Cart →
            </button>
          </div>

          <div className="product-more-info">
            <h4 className="more-info-title">More Info</h4>
            <ul>
              <li>Available in a comprehensive range of sizes</li>
              <li>Pre-softened for enhanced comfort and flexibility</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="product-bottom-section">
        <h2 className="section-heading">Product Overview</h2>
        <p className="product-description">{product.description}</p>
        <ul className="product-features-list">
          <li>All-day comfort with soft cushioning and ergonomic design</li>
          <li>Breathable materials to keep your feet cool and fresh</li>
          <li>Versatile style — perfect for work, weekends, or travel</li>
          <li>Lightweight sole for easy movement and reduced fatigue</li>
          <li>Premium craftsmanship with durable stitching and finishes</li>
        </ul>

        <h2 className="section-heading">Product Specification</h2>
        <table className="specification-table">
          <tbody>
            <tr>
              <th>Material:</th>
              <td>{product.material || 'N/A'}</td>
            </tr>
            <tr>
              <th>Product Type:</th>
              <td>{product.product_type || 'N/A'}</td>
            </tr>
            <tr>
              <th>Heel Type:</th>
              <td>{product.heel_type || 'N/A'}</td>
            </tr>
            <tr>
              <th>Available Sizes:</th>
              <td>US 6-9 (EU 39-44)</td>
            </tr>
            <tr>
              <th>Weight:</th>
              <td>{product.weight || 'N/A'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
