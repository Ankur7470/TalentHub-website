import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import "./Messages.scss";
import moment from "moment";
import { FaSearch, FaInbox, FaRegEnvelope, FaRegEnvelopeOpen } from "react-icons/fa";
import Loader from "../../components/loader/Loader";

const Messages = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all, unread, read

  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["conversations"],
    queryFn: () =>
      api.get(`/conversations`).then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: (id) => {
      return api.put(`/conversations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["conversations"]);
    },
  });

  const handleRead = (id) => {
    mutation.mutate(id);
  };

  // Filter and search conversations
  const filteredConversations = data?.filter(c => {
    const matchesSearch = search.trim() === "" || 
      c.lastMessage?.toLowerCase().includes(search.toLowerCase());
      
    const matchesFilter = 
      filter === "all" || 
      (filter === "unread" && ((currentUser.isSeller && !c.readBySeller) || (!currentUser.isSeller && !c.readByBuyer))) ||
      (filter === "read" && ((currentUser.isSeller && c.readBySeller) || (!currentUser.isSeller && c.readByBuyer)));
      
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="messages-page">
      <div className="container">
        <div className="messages-header">
          <h1>Messages</h1>
          
          <div className="messages-actions">
            <div className="search-bar">
              <FaSearch />
              <input 
                type="text" 
                placeholder="Search messages..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="filter-buttons">
              <button 
                className={filter === "all" ? "active" : ""} 
                onClick={() => setFilter("all")}
              >
                <FaInbox /> All
              </button>
              <button 
                className={filter === "unread" ? "active" : ""} 
                onClick={() => setFilter("unread")}
              >
                <FaRegEnvelope /> Unread
              </button>
              <button 
                className={filter === "read" ? "active" : ""} 
                onClick={() => setFilter("read")}
              >
                <FaRegEnvelopeOpen /> Read
              </button>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <Loader message="Loading conversations..." />
        ) : error ? (
          <div className="error-message">Error loading messages. Please try again.</div>
        ) : filteredConversations?.length === 0 ? (
          <div className="empty-state">
            <FaInbox className="empty-icon" />
            <h3>No messages found</h3>
            <p>
              {search ? "No messages match your search." : filter !== "all" ? "No messages match your filter." : "When you connect with other users, your conversations will appear here."}
            </p>
          </div>
        ) : (
          <div className="messages-list">
            {filteredConversations?.map((c) => (
              <div
                className={`message-item ${
                  ((currentUser.isSeller && !c.readBySeller) ||
                    (!currentUser.isSeller && !c.readByBuyer)) &&
                  "unread"
                }`}
                key={c.id}
              >
                <div className="message-content">
                  <Link to={`/message/${c.id}`} className="message-link">
                    <div className="user-info">
                      <span className="username">{currentUser.isSeller ? c.buyerId : c.sellerId}</span>
                      <span className="time">{moment(c.updatedAt).fromNow()}</span>
                    </div>
                    <p className="message-preview">
                      {c?.lastMessage?.substring(0, 100)}{c?.lastMessage?.length > 100 ? "..." : ""}
                    </p>
                  </Link>
                  
                  {((currentUser.isSeller && !c.readBySeller) ||
                    (!currentUser.isSeller && !c.readByBuyer)) && (
                    <button 
                      className="mark-read"
                      onClick={() => handleRead(c.id)}
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
