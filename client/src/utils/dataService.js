import api from "./api";

// Gigs
export const fetchGigs = async (filters = {}) => {
  const { category, search, min, max, sort } = filters;
  let query = "";
  
  if (category) query += `?cat=${category}`;
  if (search) query += query ? `&search=${search}` : `?search=${search}`;
  if (min) query += query ? `&min=${min}` : `?min=${min}`;
  if (max) query += query ? `&max=${max}` : `?max=${max}`;
  if (sort) query += query ? `&sort=${sort}` : `?sort=${sort}`;
  
  return newRequest.get(`/gigs${query}`);
};

export const fetchGigById = async (id) => {
  return api.get(`/gigs/single/${id}`);
};

export const fetchUserGigs = async (userId) => {
  return api.get(`/gigs?userId=${userId}`);
};

// Users
export const fetchUserById = async (id) => {
  return api.get(`/users/${id}`);
};

// Reviews
export const fetchReviewsByGigId = async (gigId) => {
  return api.get(`/reviews/${gigId}`);
};

export const createReview = async (review) => {
  return api.post("/reviews", review);
};

// Messages
export const fetchConversations = async () => {
  return api.get("/conversations");
};

export const fetchMessages = async (conversationId) => {
  return api.get(`/messages/${conversationId}`);
};

export const createMessage = async (message) => {
  return api.post("/messages", message);
};

export const markConversationAsRead = async (id) => {
  return api.put(`/conversations/${id}`);
};

export const createConversation = async (to) => {
  return api.post("/conversations", { to });
};
