import React, { useEffect, useRef, useState } from "react";
import "./Gigs.scss";
import GigCard from "../../components/gigCard/GigCard";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useLocation } from "react-router-dom";
import { FaFilter, FaSort, FaChevronDown, FaSearch } from "react-icons/fa";
import Loader from "../../components/loader/Loader";

function Gigs() {
  const [sort, setSort] = useState("sales");
  const [openSort, setOpenSort] = useState(false);
  const [openFilters, setOpenFilters] = useState(false);
  const minRef = useRef();
  const maxRef = useRef();
  const sortRef = useRef(null);

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const categoryParam = queryParams.get('cat') || '';
  const searchParam = queryParams.get('search') || '';

  const searchQuery = categoryParam ? `cat=${categoryParam}` : searchParam ? `cat=${searchParam}` : '';
  
  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["gigs", search, sort],
    queryFn: () =>
      newRequest
        .get(
          `/gigs?${searchQuery}&min=${minRef.current?.value || 0}&max=${maxRef.current?.value || 9999}&sort=${sort}`
        )
        .then((res) => res.data),
  });

  const reSort = (type) => {
    setSort(type);
    setOpenSort(false);
  };

  useEffect(() => {
    refetch();
  }, [sort]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setOpenSort(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const apply = () => {
    refetch();
    setOpenFilters(false);
  };

  const getPageTitle = () => {
    if (categoryParam) {
      // Convert category parameter to display format (e.g., "graphics" to "Graphics & Design")
      const categoryMap = {
        "graphics": "Graphics & Design",
        "digital": "Digital Marketing",
        "writing": "Writing & Translation",
        "video": "Video & Animation",
        "music": "Music & Audio",
        "programming": "Programming & Tech",
        "business": "Business",
        "lifestyle": "Lifestyle"
      };
      return categoryMap[categoryParam] || categoryParam;
    } else if (searchParam) {
      return `Results for "${searchParam}"`;
    }
    return "All Services";
  };

  return (
    <div className="gigs-page">
      <div className="container">
         <div className="gigs-header">
          <div className="header-content">
            <h1>{getPageTitle()}</h1>
            <p>
              {searchParam 
                ? `Explore services related to "${searchParam}"`
                : categoryParam 
                  ? `Explore the best ${getPageTitle()} services from our talented freelancers`
                  : "Explore the boundaries of art and technology with TalentHub's talented freelancers"
              }
            </p>
          </div>
        </div>

        <div className="filters-section">
          <div className="filters-row">
            <div className="budget-filter">
              <span>Budget</span>
              <div className="price-inputs">
                <input ref={minRef} type="number" placeholder="min" />
                <span className="separator">to</span>
                <input ref={maxRef} type="number" placeholder="max" />
              </div>
              <button onClick={apply} className="apply-btn">Apply</button>
            </div>

            <div className="delivery-filter">
              <span>Delivery Time</span>
              <div className="delivery-dropdown">
                <select defaultValue="">
                  <option value="" disabled>Select</option>
                  <option value="1">Express 24H</option>
                  <option value="3">Up to 3 days</option>
                  <option value="7">Up to 7 days</option>
                  <option value="any">Anytime</option>
                </select>
              </div>
            </div>

            <div className="sort-control">
              <span className="sortBy">Sort by</span>
              <div className="sort-dropdown" ref={sortRef}>
                <div className="current-sort" onClick={() => setOpenSort(!openSort)}>
                  <span>{sort === "sales" ? "Best Selling" : sort === "createdAt" ? "Newest" : "Popular"}</span>
                  <FaChevronDown className={openSort ? 'rotate' : ''} />
                </div>

                {openSort && (
                  <div className="sort-options">
                    {sort === "sales" ? (
                      <div onClick={() => reSort("createdAt")}>Newest</div>
                    ) : (
                      <div onClick={() => reSort("sales")}>Best Selling</div>
                    )}
                    <div onClick={() => reSort("popular")}>Popular</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

         {isLoading ? (
          <Loader message="Loading gigs..." />
        ) : error ? (
          <div className="error-container">
            <p>Something went wrong! Please try again later.</p>
          </div>
        ) : data.length === 0 ? (
          <div className="no-results">
            <FaSearch/>
            <h2>No gigs found</h2>
            <p>Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        ) : (
          <div className="gigs-grid">
            {data.map((gig) => (
              <GigCard key={gig._id} item={gig} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Gigs;
