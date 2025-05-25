import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Orders.scss";
import { useQuery } from "@tanstack/react-query";
import api from "../../utils/api";
import { FaSearch, FaFilter, FaComment, FaShoppingBag, FaChevronDown } from "react-icons/fa";
import Loader from "../../components/loader/Loader";

const Orders = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all, active, completed
  const [openFilter, setOpenFilter] = useState(false);

  const navigate = useNavigate();
  
  const { isLoading, error, data } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      api.get(`/orders`).then((res) => res.data),
  });

  const handleContact = async (order) => {
    const sellerId = order.sellerId;
    const buyerId = order.buyerId;
    const id = sellerId + buyerId;

    try {
      const res = await api.get(`/conversations/single/${id}`);
      navigate(`/message/${res.data.id}`);
    } catch (err) {
      if (err.response.status === 404) {
        const res = await api.post(`/conversations/`, {
          to: currentUser.seller ? buyerId : sellerId,
        });
        navigate(`/message/${res.data.id}`);
      }
    }
  };

  // Filter orders
  const filteredOrders = data?.filter(order => {
    const matchesSearch = search.trim() === "" || 
      order.title.toLowerCase().includes(search.toLowerCase());
      
    const matchesFilter = 
      filter === "all" || 
      (filter === "active" && !order.isCompleted) ||
      (filter === "completed" && order.isCompleted);
      
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="orders-page">
      <div className="container">
        <div className="orders-header">
          <h1>Orders</h1>
          
          <div className="orders-actions">
            <div className="search-bar">
              <FaSearch />
              <input 
                type="text" 
                placeholder="Search orders..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="filter-dropdown">
              <button 
                className="filter-button"
                onClick={() => setOpenFilter(!openFilter)}
              >
                <FaFilter />
                <span>
                  {filter === "all" 
                    ? "All Orders" 
                    : filter === "active" 
                      ? "Active Orders" 
                      : "Completed Orders"}
                </span>
                <FaChevronDown className={openFilter ? "rotate" : ""} />
              </button>
              
              {openFilter && (
                <div className="filter-options">
                  <div onClick={() => { setFilter("all"); setOpenFilter(false); }}>All Orders</div>
                  <div onClick={() => { setFilter("active"); setOpenFilter(false); }}>Active Orders</div>
                  <div onClick={() => { setFilter("completed"); setOpenFilter(false); }}>Completed Orders</div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <Loader message="Loading orders..." />
        ) : error ? (
          <div className="error-message">Error loading orders. Please try again.</div>
        ) : filteredOrders?.length === 0 ? (
          <div className="empty-state">
            <FaShoppingBag className="empty-icon" />
            <h3>No orders found</h3>
            <p>
              {search 
                ? "No orders match your search." 
                : filter !== "all" 
                  ? `You don't have any ${filter} orders.` 
                  : "When you place or receive orders, they will appear here."}
            </p>
            {!search && filter === "all" && (
              <Link to="/gigs" className="browse-button">
                Browse Gigs
              </Link>
            )}
          </div>
        ) : (
          <div className="orders-grid">
            {filteredOrders?.map((order) => (
              <div 
                className={`order-card ${order.isCompleted ? "completed" : "active"}`} 
                key={order._id}
              >
                <div className="order-image">
                  <img src={order.img || "/img/noimage.jpg"} alt={order.title} />
                  <div className="order-status">
                    {order.isCompleted ? "Completed" : "Active"}
                  </div>
                </div>
                
                <div className="order-details">
                  <h3>{order.title}</h3>
                  
                  <div className="order-info">
                    <div className="info-item">
                      <span className="label">Price:</span>
                      <span className="value">${order.price}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Order Date:</span>
                      <span className="value">{formatDate(order.createdAt)}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">{currentUser.isSeller ? "Buyer" : "Seller"}:</span>
                      <span className="value">{currentUser.isSeller ? order.buyerId : order.sellerId}</span>
                    </div>
                  </div>
                  
                  <div className="order-actions">
                    <button 
                      className="contact-button"
                      onClick={() => handleContact(order)}
                    >
                      <FaComment /> Contact
                    </button>
                    
                    <Link 
                      to={`/order/${order._id}`} 
                      className="view-button"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
