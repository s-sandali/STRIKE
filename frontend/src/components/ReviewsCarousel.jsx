import { useRef } from 'react';
import shoe16 from '../assets/shoe16.jpg';
import shoe17 from '../assets/shoe17.jpg';
import shoe18 from '../assets/shoe18.jpg';
import shoe19 from '../assets/shoe19.jpg';
import user1 from '../assets/user1.jpg';
import user2 from '../assets/user2.jpg';
import user3 from '../assets/user3.jpg';
import user4 from '../assets/user4.jpg';
import { Star, ArrowLeft, ArrowRight } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    shoeImg: shoe16,
    userImg: user1,
    name: 'Harper Jackson',
    text: "“I've never worn shoes this stylish that also feel like walking on clouds. The quality is top-notch, and I get compliments everywhere I go!”",
    rating: 5
  },
  {
    id: 2,
    shoeImg: shoe17,
    userImg: user2,
    name: 'Mason Jack',
    text: "“Finding shoes that fit well is always a struggle for me. But here, the sizing guide was spot on and the shoes feel custom-made. Highly recommend!”",
    rating: 5
  },
  {
    id: 3,
    shoeImg: shoe18,
    userImg: user3,
    name: 'Avery Wyatt',
    text: "“I've never worn shoes this stylish that also feel like walking on clouds. The quality is top-notch, and I get compliments everywhere I go!”",
    rating: 5
  },
  {
    id: 4,
    shoeImg: shoe19,
    userImg: user4,
    name: 'Evelyn Carter',
    text: "“Incredible comfort and style. I was hesitant to buy shoes online, but these exceeded all my expectations. Will definitely be a returning customer!”",
    rating: 5
  }
];

export default function ReviewsCarousel() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth / 2 + 16; // scroll by roughly one card width
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="reviews-section">
      <div className="reviews-header">
        <h2 className="reviews-title">What People Says</h2>
        <div className="reviews-nav">
          <button className="nav-btn" onClick={() => scroll('left')}>
            <ArrowLeft size={20} />
          </button>
          <button className="nav-btn" onClick={() => scroll('right')}>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      <div className="reviews-carousel-wrapper">
        <div className="reviews-scroll-container" ref={scrollRef}>
          {REVIEWS.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-shoe-img">
                <img src={review.shoeImg} alt="Shoe reviewed" />
              </div>
              <div className="review-content">
                <p className="review-text">{review.text}</p>
                <div className="review-author">
                  <img src={review.userImg} alt={review.name} className="author-img" />
                  <div className="author-info">
                    <h4 className="author-name">{review.name}</h4>
                    <div className="author-rating">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} size={14} fill="#f97316" color="#f97316" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
