import Slide from "../../components/slide/Slide";
import CatCard from "../../components/catCard/CatCard";
import "./PopularCategories.scss";
import { CATEGORIES } from "../../constants/categories";

const PopularCategories = () => {
  return (
    <section className="categories-section">
      <div className="container">
        <h2>Popular Categories</h2>
        <Slide slidesToShow={3}>
          {CATEGORIES.filter((category) => category.fet === "1").map((category) => (
            <CatCard
              key={category.id}
              card={{
                id: category.id,
                title: category.title,
                desc: `Explore ${category.title} services`,
                img: category.img,
                cat: category.id,
              }}
            />
          ))}
        </Slide>
      </div>
    </section>
  );
};

export default PopularCategories;
