import { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";
import { toast } from "react-toastify";

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [prevUnreadKey, setPrevUnreadKey] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const { data: conversations } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => api.get("/conversations").then((res) => res.data),
    refetchInterval: 8000,
    enabled: !!currentUser,
  });

  useEffect(() => {
    if (!conversations || !currentUser) return;

    const unreadConversations = conversations.filter((c) =>
      (currentUser._id === c.sellerId && !c.readBySeller) ||
      (currentUser._id === c.buyerId && !c.readByBuyer)
    );

    const unreadIds = unreadConversations.map(c => c._id).sort();
    const currentKey = JSON.stringify(unreadIds);

    // Only show toast if there are new unread messages
    if (isInitialized && currentKey !== prevUnreadKey && unreadIds.length > 0) {
      const prevIds = prevUnreadKey ? JSON.parse(prevUnreadKey) : [];
      const newMessages = unreadIds.filter(id => !prevIds.includes(id));
      
      if (newMessages.length > 0) {
        toast.info("📨 You have new messages!");
      }
    }

    setUnreadCount(unreadIds.length);
    setPrevUnreadKey(currentKey);
    
    if (!isInitialized) {
      setIsInitialized(true);
    }
  }, [conversations, currentUser]);

  return (
    <MessageContext.Provider value={{ unreadCount }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => useContext(MessageContext);
