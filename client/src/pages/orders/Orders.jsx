// import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "./Orders.scss";
// import { useQuery } from "@tanstack/react-query";
// import api from "../../utils/api";
// import {
//   FaSearch,
//   FaFilter,
//   FaComment,
//   FaShoppingBag,
//   FaChevronDown,
// } from "react-icons/fa";
// import Loader from "../../components/loader/Loader";
// import useAuth from "../../hooks/useAuth";
// import { toast } from "react-toastify";

// const Orders = () => {
//   const { currentUser } = useAuth();
//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState("all"); // all, active, completed
//   const [openFilter, setOpenFilter] = useState(false);
//   const [userMap, setUserMap] = useState({}); // Stores userId => userData

//   const navigate = useNavigate();

//   const { isLoading, error, data: orders } = useQuery({
//     queryKey: ["orders"],
//     queryFn: () => api.get(`/orders`).then((res) => res.data),
//   });

//   // Fetch usernames based on seller/buyer IDs
//   useEffect(() => {
//     if (!orders || !currentUser) return;

//     // Get all userIds except currentUser
//     const otherUserIds = orders.map((order) =>
//       currentUser._id === order.buyerId ? order.sellerId : order.buyerId
//     );

//     const uniqueIds = [...new Set(otherUserIds)];

//     Promise.all(
//       uniqueIds.map((id) =>
//         api.get(`/users/${id}`).then((res) => ({ id, data: res.data }))
//       )
//     )
//       .then((res) => {
//         const map = {};
//         res.forEach((r) => {
//           map[r.id] = r.data;
//         });
//         setUserMap(map);
//       })
//       .catch((err) => {
//         console.error("Failed to fetch user data:", err);
//       });
//   }, [orders]);

//   // Fix contact logic (same as in Gig page)
//   const handleContact = async (order) => {
//     if (order.sellerId === order.buyerId) {
//       toast.info("You cannot message yourself.");
//       return;
//     }

//     try {
//       const res = await api.get("/conversations");

//       const existingConv = res.data.find(
//         (conv) =>
//           (conv.sellerId === order.sellerId && conv.buyerId === order.buyerId) ||
//           (conv.buyerId === order.sellerId && conv.sellerId === order.buyerId)
//       );

//       if (existingConv) return navigate(`/message/${existingConv._id}`);

//       // Create if not exists
//       const to =
//         currentUser._id === order.sellerId ? order.buyerId : order.sellerId;

//       const newConv = await api.post("/conversations", { to });
//       navigate(`/message/${newConv.data._id}`);
//     } catch (err) {
//       console.error("Contact creation failed:", err);
//     }
//   };

//   // Filter logic
//   const filteredOrders = orders?.filter((order) => {
//     const matchesSearch =
//       search.trim() === "" ||
//       order.title.toLowerCase().includes(search.toLowerCase());

//     const matchesFilter =
//       filter === "all" ||
//       (filter === "active" && !order.isCompleted) ||
//       (filter === "completed" && order.isCompleted);

//     return matchesSearch && matchesFilter;
//   });

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   return (
//     <div className="orders-page">
//       <div className="container">
//         <div className="orders-header">
//           <h1>Orders</h1>

//           <div className="orders-actions">
//             <div className="search-bar">
//               <FaSearch />
//               <input
//                 type="text"
//                 placeholder="Search orders..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//             </div>

//             <div className="filter-dropdown">
//               <button
//                 className="filter-button"
//                 onClick={() => setOpenFilter(!openFilter)}
//               >
//                 <FaFilter />
//                 <span>
//                   {filter === "all"
//                     ? "All Orders"
//                     : filter === "active"
//                       ? "Active Orders"
//                       : "Completed Orders"}
//                 </span>
//                 <FaChevronDown className={openFilter ? "rotate" : ""} />
//               </button>

//               {openFilter && (
//                 <div className="filter-options">
//                   <div
//                     onClick={() => {
//                       setFilter("all");
//                       setOpenFilter(false);
//                     }}
//                   >
//                     All Orders
//                   </div>
//                   <div
//                     onClick={() => {
//                       setFilter("active");
//                       setOpenFilter(false);
//                     }}
//                   >
//                     Active Orders
//                   </div>
//                   <div
//                     onClick={() => {
//                       setFilter("completed");
//                       setOpenFilter(false);
//                     }}
//                   >
//                     Completed Orders
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Loading and error states */}
//         {isLoading ? (
//           <Loader message="Loading orders..." />
//         ) : error ? (
//           <div className="error-message">Error loading orders. Please try again.</div>
//         ) : filteredOrders?.length === 0 ? (
//           <div className="empty-state">
//             <FaShoppingBag className="empty-icon" />
//             <h3>No orders found</h3>
//             <p>
//               {search
//                 ? "No orders match your search."
//                 : filter !== "all"
//                   ? `You don't have any ${filter} orders.`
//                   : "When you place or receive orders, they will appear here."}
//             </p>
//             {!search && filter === "all" && (
//               <Link to="/gigs" className="browse-button">
//                 Browse Gigs
//               </Link>
//             )}
//           </div>
//         ) : (
//           <div className="orders-grid">
//             {filteredOrders?.map((order) => {
//               const otherUserId =
//                 currentUser._id === order.sellerId
//                   ? order.buyerId
//                   : order.sellerId;

//               const user = userMap[otherUserId];
//               const username = user?.username || otherUserId;

//               return (
//                 <div
//                   className={`order-card ${order.isCompleted ? "completed" : "active"
//                     }`}
//                   key={order._id}
//                 >
//                   <div className="order-image">
//                     <img
//                       src={order.img || "/img/noimage.jpg"}
//                       alt={order.title}
//                     />
//                     <div className="order-status">
//                       {order.isCompleted ? "Completed" : "Active"}
//                     </div>
//                   </div>

//                   <div className="order-details">
//                     <h3>{order.title}</h3>

//                     <div className="order-info">
//                       <div className="info-item">
//                         <span className="label">Price:</span>
//                         <span className="value">${order.price}</span>
//                       </div>
//                       <div className="info-item">
//                         <span className="label">Date:</span>
//                         <span className="value">
//                           {formatDate(order.createdAt)}
//                         </span>
//                       </div>
//                       <div className="info-item">
//                         <span className="label">
//                           {currentUser._id === order.sellerId
//                             ? "Buyer:"
//                             : "Seller:"}
//                         </span>
//                         <span className="value">{username}</span>
//                       </div>
//                     </div>

//                     <div className="order-actions">
//                       <button
//                         className="contact-button"
//                         onClick={() => handleContact(order)}
//                       >
//                         <FaComment /> Contact
//                       </button>

//                       <Link to={`/order/${order._id}`} className="view-button">
//                         View Details
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Orders;


import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Orders.scss";
import { useQuery } from "@tanstack/react-query";
import api from "../../utils/api";
import {
  FaSearch,
  FaFilter,
  FaComment,
  FaShoppingBag,
  FaChevronDown,
} from "react-icons/fa";
import Loader from "../../components/loader/Loader";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";

const Orders = () => {
  const { currentUser } = useAuth();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [openFilter, setOpenFilter] = useState(false);
  const [userMap, setUserMap] = useState({});
  const navigate = useNavigate();

  const { isLoading, error, data: orders } = useQuery({
    queryKey: ["orders"],
    queryFn: () => api.get("/orders").then((res) => res.data),
  });

  // ✅ Get all the "other" users involved in orders
  useEffect(() => {
    if (!orders) return;

    const otherUserIds = orders.map((o) =>
      currentUser._id === o.sellerId ? o.buyerId : o.sellerId
    );

    const uniqueIds = [...new Set(otherUserIds)];
    Promise.all(
      uniqueIds.map((id) =>
        api.get(`/users/${id}`).then((res) => ({ id, data: res.data }))
      )
    )
      .then((results) => {
        const map = {};
        results.forEach((r) => (map[r.id] = r.data));
        setUserMap(map);
      })
      .catch((err) => console.error("Failed to fetch users", err));
  }, [orders]);

  // ✅ Contact the other user (depending on role)
  const handleContact = async (order) => {
    const to =
      currentUser._id === order.sellerId ? order.buyerId : order.sellerId;

    if (to === currentUser._id) {
      toast.info("You cannot message yourself.");
      return;
    }

    try {
      const res = await api.get("/conversations");
      const existing = res.data.find(
        (c) =>
          (c.sellerId === currentUser._id && c.buyerId === to) ||
          (c.buyerId === currentUser._id && c.sellerId === to)
      );

      if (existing) return navigate(`/message/${existing._id}`);

      const newConv = await api.post("/conversations", { to });
      navigate(`/message/${newConv.data._id}`);
    } catch (err) {
      console.error("Error contacting user", err);
      toast.error("Failed to start conversation.");
    }
  };

  // ✅ Filter orders by status & search
  // const filteredOrders = orders?.filter((order) => {
  //   const matchesSearch =
  //     search.trim() === "" ||
  //     order.title.toLowerCase().includes(search.toLowerCase());

  //   const matchesFilter =
  //     filter === "all" ||
  //     (filter === "active" && !order.isCompleted) ||
  //     (filter === "completed" && order.isCompleted);

  //   return matchesSearch && matchesFilter;
  // });
  // Since all orders returned are completed
  const filteredOrders = orders?.filter((order) =>
    order.title.toLowerCase().includes(search.toLowerCase())
  );


  const formatDate = (isoDate) =>
    new Date(isoDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="orders-page">
      <div className="container">
        <div className="orders-header">
          <h1>Your Orders</h1>

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
                      ? "Active"
                      : "Completed"}
                </span>
                <FaChevronDown className={openFilter ? "rotate" : ""} />
              </button>

              {openFilter && (
                <div className="filter-options">
                  <div onClick={() => setFilter("all")}>All</div>
                  <div onClick={() => setFilter("active")}>Active</div>
                  <div onClick={() => setFilter("completed")}>Completed</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {isLoading ? (
          <Loader message="Loading your orders..." />
        ) : error ? (
          <div className="error">Oops. Could not load orders.</div>
        ) : filteredOrders?.length === 0 ? (
          <div className="empty-state">
            <FaShoppingBag className="empty-icon" />
            <p>No matching orders found.</p>
          </div>
        ) : (
          <div className="orders-grid">
            {filteredOrders.map((order) => {
              const isSeller = currentUser._id === order.sellerId;
              const otherUserId = isSeller ? order.buyerId : order.sellerId;
              const otherUser = userMap[otherUserId];
              const name = otherUser?.username || "Unknown";

              return (
                <div
                  className={`order-card ${order.isCompleted ? "completed" : "active"}`}
                  key={order._id}
                >
                  <div className="order-image">
                    <img src={order.img || "/img/noimage.jpg"} alt={order.title} />
                    <span className="order-status">
                      {order.isCompleted ? "Completed" : "Active"}
                    </span>
                  </div>

                  <div className="order-details">
                    <h3>{order.title}</h3>
                    <div className="order-info">
                      {/* <div className="info-item">
                        <span className="label">{isSeller ? "Buyer" : "Seller"}:</span>
                        <span className="value">{name}</span>
                      </div> */}
                      <div className="info-item">
                        <span className="label">Seller:</span>
                        <span className="value">
                          {order.sellerId === currentUser._id
                            ? "You"
                            : userMap[order.sellerId]?.username || order.sellerId}
                        </span>
                      </div>

                      <div className="info-item">
                        <span className="label">Buyer:</span>
                        <span className="value">
                          {order.buyerId === currentUser._id
                            ? "You"
                            : userMap[order.buyerId]?.username || order.buyerId}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="label">Price:</span>
                        <span className="value">${order.price}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Date:</span>
                        <span className="value">{formatDate(order.createdAt)}</span>
                      </div>
                    </div>

                    <div className="order-actions">
                      <button onClick={() => handleContact(order)} className="contact-button">
                        <FaComment /> Contact
                      </button>
                      <Link to={`/order/${order._id}`} className="view-button">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
