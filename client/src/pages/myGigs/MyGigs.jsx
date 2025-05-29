import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./MyGigs.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../utils/api";
import { FaPlus, FaTrash, FaEdit, FaSearch, FaSort, FaChevronDown } from "react-icons/fa";
import Loader from "../../components/loader/Loader";
import useAuth from "../../hooks/useAuth";

function MyGigs() {
  const { currentUser } = useAuth();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [openSort, setOpenSort] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["myGigs", sort],
    queryFn: () =>
      api.get(`/gigs/mygigs?sort=${sort}`).then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: (id) => {
      return api.delete(`/gigs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
      setDeleteConfirm(null);
    },
  });

  const handleDelete = (id) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = (id) => {
    mutation.mutate(id);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  // Filter gigs by search term
  const filteredGigs = data?.filter(gig =>
    gig.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mygigs-page">
      <div className="container">
        <div className="mygigs-header">
          <h1>My Gigs</h1>

          <div className="header-actions">
            <div className="search-bar">
              <FaSearch />
              <input
                type="text"
                placeholder="Search your gigs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="sort-dropdown">
              <button
                className="sort-button"
                onClick={() => setOpenSort(!openSort)}
              >
                <FaSort />
                <span>
                  {sort === "newest"
                    ? "Newest"
                    : sort === "oldest"
                      ? "Oldest"
                      : sort === "sales"
                        ? "Most Sales"
                        : "Sort By"}
                </span>
                <FaChevronDown className={openSort ? "rotate" : ""} />
              </button>

              {openSort && (
                <div className="sort-options">
                  <div onClick={() => { setSort("newest"); setOpenSort(false); }}>Newest</div>
                  <div onClick={() => { setSort("oldest"); setOpenSort(false); }}>Oldest</div>
                  <div onClick={() => { setSort("sales"); setOpenSort(false); }}>Most Sales</div>
                </div>
              )}
            </div>

            {currentUser.isSeller && (
              <Link to="/add" className="add-button">
                <FaPlus /> Add New Gig
              </Link>
            )}
          </div>
        </div>

        {isLoading ? (
          <Loader message="Loading your gigs..." />
        ) : error ? (
          <div className="error-message">Error loading gigs. Please try again.</div>
        ) : filteredGigs?.length === 0 ? (
          <div className="empty-state">
            <h3>No gigs found</h3>
            <p>
              {search
                ? "No gigs match your search."
                : "You haven't created any gigs yet. Create your first gig to start selling your services."}
            </p>
            {!search && (
              <Link to="/add" className="create-button">
                <FaPlus /> Create Your First Gig
              </Link>
            )}
          </div>
        ) : (
          <div className="gigs-grid">
            {filteredGigs?.map((gig) => (
              <div className="gig-card" key={gig._id}>
                <div className="gig-image">
                  <img src={gig.cover} alt={gig.title} />
                  <div className="gig-actions">
                    <Link to={`/gig/${gig._id}`} className="view-button">
                      View
                    </Link>
                    <Link to={`/edit-gig/${gig._id}`} className="edit-button">
                      <FaEdit />
                    </Link>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(gig._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <div className="gig-details">
                  <h3>{gig.title}</h3>
                  <div className="gig-stats">
                    <div className="stat">
                      <span className="label">Price:</span>
                      <span className="value">${gig.price}</span>
                    </div>
                    <div className="stat">
                      <span className="label">Orders:</span>
                      <span className="value">{gig.sales}</span>
                    </div>
                    <div className="stat">
                      <span className="label">Impressions:</span>
                      <span className="value">{Math.floor(Math.random() * 1000)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {deleteConfirm && (
          <div className="delete-modal">
            <div className="delete-content">
              <h3>Confirm Deletion</h3>
              <p>Are you sure you want to delete this gig? This action cannot be undone.</p>
              <div className="delete-actions">
                <button
                  className="cancel-button"
                  onClick={cancelDelete}
                >
                  Cancel
                </button>
                <button
                  className="confirm-button"
                  onClick={() => confirmDelete(deleteConfirm)}
                >
                  {mutation.isLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyGigs;
