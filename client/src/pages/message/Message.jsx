import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../utils/api";
import "./Message.scss";
import { FaArrowLeft, FaPaperPlane, FaPaperclip } from "react-icons/fa";
import Loader from "../../components/loader/Loader";

const Message = () => {
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const hasMarkedAsRead = useRef(false); 

  const queryClient = useQueryClient();

  // Fetch messages
  const { isLoading, error, data } = useQuery({
    queryKey: ["messages", id],
    queryFn: () => api.get(`/messages/${id}`).then((res) => res.data),
    refetchInterval: 5000,
  });

  // Fetch conversation details
  const { data: conversationData } = useQuery({
    queryKey: ["conversation", id],
    queryFn: () => api.get(`/conversations/single/${id}`).then((res) => res.data),
  });

  // Mark as read mutation (without auto-invalidation)
  const markAsReadMutation = useMutation({
    mutationFn: () => api.put(`/conversations/${id}`),
    onSuccess: () => {
      hasMarkedAsRead.current = true;
      // Don't invalidate conversations immediately - let polling handle it
      setTimeout(() => {
        queryClient.invalidateQueries(["conversations"]);
      }, 1000);
    },
  });

  // Send message mutation
  const mutation = useMutation({
    mutationFn: (message) => {
      return api.post(`/messages`, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["messages", id]);
      setMessage("");
    },
  });

  // Mark as read logic with proper guards
  useEffect(() => {
    if (!conversationData || !currentUser || hasMarkedAsRead.current) return;

    const isCurrentUserSeller = currentUser._id === conversationData.sellerId;
    const isCurrentUserBuyer = currentUser._id === conversationData.buyerId;
    
    if (!isCurrentUserSeller && !isCurrentUserBuyer) return;

    const isUnread = isCurrentUserSeller 
      ? !conversationData.readBySeller 
      : !conversationData.readByBuyer;

    if (isUnread && !markAsReadMutation.isLoading) {
      markAsReadMutation.mutate();
    }
  }, [conversationData?.readBySeller, conversationData?.readByBuyer, currentUser._id, id]);

  // Reset read flag when conversation changes
  useEffect(() => {
    hasMarkedAsRead.current = false;
  }, [id]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (!data || data.length === 0) return;

    const container = containerRef.current;
    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop <= container.clientHeight + 100;

    if (isNearBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data?.length]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const msgToSend = message;
    setMessage("");
    mutation.mutate({
      conversationId: id,
      desc: msgToSend,
    });
  };

  const otherUserId =
    conversationData?.sellerId === currentUser._id
      ? conversationData?.buyerId
      : conversationData?.sellerId;

  const { data: otherUser } = useQuery({
    queryKey: ["user", otherUserId],
    queryFn: () => api.get(`/users/${otherUserId}`).then((res) => res.data),
    enabled: !!otherUserId,
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="message-page">
      <div className="container">
        <div className="message-header">
          <Link to="/messages" className="back-button">
            <FaArrowLeft /> Back to Messages
          </Link>

          {otherUser && (
            <div className="chat-with">
              <img
                src={otherUser.img || "/img/avatar-1968236_1920.png"}
                alt={otherUser.username}
              />
              <div className="user-info">
                <h2>{otherUser.username}</h2>
                <span>{otherUser.isSeller ? "Seller" : "Buyer"}</span>
              </div>
            </div>
          )}
        </div>

        <div className="messages-container" ref={containerRef}>
          {isLoading ? (
            <Loader message="Loading messages..." />
          ) : error ? (
            <div className="error-message">Error loading messages. Please try again.</div>
          ) : (
            <div className="messages-list">
              {data?.map((m) => (
                <div
                  className={`message ${
                    m.userId === currentUser._id ? "own" : "other"
                  }`}
                  key={m._id}
                >
                  <div className="message-content">
                    <p>{m.desc}</p>
                    <span className="time">{formatDate(m.createdAt)}</span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <form className="message-input" onSubmit={handleSubmit}>
          <button type="button" className="attach-button">
            <FaPaperclip />
          </button>

          <textarea
            disabled={mutation.isLoading}
            placeholder="Write a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />

          <button
            type="submit"
            className="send-button"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? (
              <span className="loader-spinner" />
            ) : (
              <FaPaperPlane />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Message;

