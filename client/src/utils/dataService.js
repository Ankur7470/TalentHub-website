import newRequest from "./newRequest";

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
  return newRequest.get(`/gigs/single/${id}`);
};

export const fetchUserGigs = async (userId) => {
  return newRequest.get(`/gigs?userId=${userId}`);
};

// Users
export const fetchUserById = async (id) => {
  return newRequest.get(`/users/${id}`);
};

// Reviews
export const fetchReviewsByGigId = async (gigId) => {
  return newRequest.get(`/reviews/${gigId}`);
};

export const createReview = async (review) => {
  return newRequest.post("/reviews", review);
};

// Messages
export const fetchConversations = async () => {
  return newRequest.get("/conversations");
};

export const fetchMessages = async (conversationId) => {
  return newRequest.get(`/messages/${conversationId}`);
};

export const createMessage = async (message) => {
  return newRequest.post("/messages", message);
};

export const markConversationAsRead = async (id) => {
  return newRequest.put(`/conversations/${id}`);
};

export const createConversation = async (to) => {
  return newRequest.post("/conversations", { to });
};
