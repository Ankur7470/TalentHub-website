import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import "./Messages.scss";
import moment from "moment";
import {
  FaSearch,
  FaInbox,
  FaRegEnvelope,
  FaRegEnvelopeOpen,
} from "react-icons/fa";
import Loader from "../../components/loader/Loader";
// import { toast } from "react-toastify";

const Messages = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [userMap, setUserMap] = useState({});

  const queryClient = useQueryClient();

  const { data: conversations, isLoading, error } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => api.get("/conversations").then((res) => res.data),
    refetchInterval: 8000,
  });

  // Consistent unread detection function
  const isConversationUnread = (c) =>
    (currentUser._id === c.sellerId && !c.readBySeller) ||
    (currentUser._id === c.buyerId && !c.readByBuyer);

  // Mark conversation as read mutation
  const mutation = useMutation({
    mutationFn: (id) => api.put(`/conversations/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["conversations"]);
    },
  });

  const handleReadBeforeNavigate = (id) => {
    const conversation = conversations?.find((c) => c._id === id);
    if (conversation && isConversationUnread(conversation)) {
      mutation.mutate(id);
    }
  };

  // Fetch usernames for conversations
  useEffect(() => {
    if (!conversations || !currentUser) return;

    const otherUserIds = conversations.map((c) =>
      c.sellerId === currentUser._id ? c.buyerId : c.sellerId
    );

    const uniqueUserIds = [...new Set(otherUserIds)];

    if (uniqueUserIds.length === 0) return;

    Promise.all(
      uniqueUserIds.map((id) =>
        api.get(`/users/${id}`).then((res) => ({ id, data: res.data }))
      )
    )
      .then((responses) => {
        const resultMap = {};
        responses.forEach((r) => (resultMap[r.id] = r.data));
        setUserMap(resultMap);
      })
      .catch((err) => {
        console.error("Failed to fetch user data:", err);
      });
  }, [conversations, currentUser]);

  // Filter by username AND message content
  const filteredConversations = conversations?.filter((c) => {
    // Get the other user's info for username search
    const otherUserId = currentUser._id === c.sellerId ? c.buyerId : c.sellerId;
    const otherUser = userMap[otherUserId];
    const username = otherUser?.username || "";

    // Search matches username OR last message content
    const matchesSearch = 
      !search.trim() ||
      username.toLowerCase().includes(search.toLowerCase()) ||
      c.lastMessage?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && isConversationUnread(c)) ||
      (filter === "read" && !isConversationUnread(c));

    return matchesSearch && matchesFilter;
  });

  if (!currentUser) {
    return <div className="error-message">Please log in to view messages.</div>;
  }

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
                placeholder="Search by username or message..."
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
          <div className="error-message">Error loading messages.</div>
        ) : filteredConversations?.length === 0 ? (
          <div className="empty-state">
            <FaInbox className="empty-icon" />
            <h3>No messages found</h3>
            <p>
              {search
                ? "No conversations match your search."
                : filter !== "all"
                ? "No messages match your filter."
                : "Start a conversation to see messages here."}
            </p>
          </div>
        ) : (
          <div className="messages-list">
            {filteredConversations.map((c) => {
              const otherUserId =
                currentUser._id === c.sellerId ? c.buyerId : c.sellerId;
              const otherUser = userMap[otherUserId];
              const username = otherUser?.username || "User";
              const unread = isConversationUnread(c);

              return (
                <div
                  className={`message-item ${unread ? "unread" : ""}`}
                  key={c._id}
                >
                  <div className="message-content">
                    <Link
                      to={`/message/${c._id}`}
                      className="message-link"
                      onClick={() => handleReadBeforeNavigate(c._id)}
                    >
                      <div className="user-info">
                        <span className="username">{username}</span>
                        <span className="time">
                          {moment(c.updatedAt).fromNow()}
                        </span>
                      </div>
                      <p className="message-preview">
                        {c.lastMessage?.substring(0, 100)}
                        {c.lastMessage?.length > 100 ? "..." : ""}
                      </p>
                    </Link>
                    {unread && <div className="unread-indicator">Unread</div>}
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

export default Messages;
