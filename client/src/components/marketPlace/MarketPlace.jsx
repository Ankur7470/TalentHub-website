import { CATEGORIES } from "../../constants/categories";
import { Link } from "react-router-dom";
import './MarketPlace.scss';

const MarketPlace = () => {
  return (
    <section className="marketplace-section">
      <div className="container">
        <h2>Explore the marketplace</h2>
        <div className="categories-grid">
          {CATEGORIES.map((category) => (
            <Link to={`/gigs?cat=${category.value}`} className="category-item">
              <img src={category.image} alt={category.title} />
              <div className="category-title">
                <span>{category.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MarketPlace;
