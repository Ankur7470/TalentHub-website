// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import React from "react";
// import { Link, useParams } from "react-router-dom";
// import newRequest from "../../utils/newRequest";
// import "./Message.scss";

// const Message = () => {
//   const { id } = useParams();
//   const currentUser = JSON.parse(localStorage.getItem("currentUser"));

//   const queryClient = useQueryClient();

//   const { isLoading, error, data } = useQuery({
//     queryKey: ["messages"],
//     queryFn: () =>
//       newRequest.get(`/messages/${id}`).then((res) => {
//         return res.data;
//       }),
//   });

//   const mutation = useMutation({
//     mutationFn: (message) => {
//       return newRequest.post(`/messages`, message);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries(["messages"]);
//     },
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     mutation.mutate({
//       conversationId: id,
//       desc: e.target[0].value,
//     });
//     e.target[0].value = "";
//   };

//   return (
//     <div className="message">
//       <div className="container">
//         <span className="breadcrumbs">
//           <Link to="/messages">Messages</Link> 
//         </span>
//         {isLoading ? (
//           "loading"
//         ) : error ? (
//           "error"
//         ) : (
//           <div className="messages">
//             {data.map((m) => (
//               <div className={m.userId === currentUser._id ? "owner item" : "item"} key={m._id}>
//                 <img
//                   src="https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=1600"
//                   alt=""
//                 />
//                 <p>{m.desc}</p>
//               </div>
//             ))}
//           </div>
//         )}
//         <hr />
//         <form className="write" onSubmit={handleSubmit}>
//           <textarea type="text" placeholder="write a message" />
//           <button type="submit">Send</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Message;
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Message.scss";
import { FaArrowLeft, FaPaperPlane, FaPaperclip } from "react-icons/fa";
import Loader from "../../components/loader/Loader";

const Message = () => {
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["messages", id],
    queryFn: () =>
      newRequest.get(`/messages/${id}`).then((res) => res.data),
    refetchInterval: 5000, // Poll for new messages every 5 seconds
  });

  const mutation = useMutation({
    mutationFn: (message) => {
      return newRequest.post(`/messages`, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["messages", id]);
      setMessage("");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const msgToSend = message; // cache it
    setMessage(""); // clear input immediately

    mutation.mutate({
      conversationId: id,
      desc: msgToSend,
    });
  };

  // Scroll to bottom when messages change
  // useEffect(() => {
  //   if (messagesEndRef.current) {
  //     messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [data]);

  // useEffect(() => {
  //   if (messagesEndRef.current && data?.length > 0) {
  //     const lastMessage = data[data.length - 1];
  //     if (lastMessage?.userId === currentUser._id) {
  //       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  //     }
  //   }
  // }, [data, currentUser._id]);

  useEffect(() => {
    const container = document.querySelector(".messages-container");
    const isNearBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
  
    if (isNearBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data]);
  
  

  // Get conversation details
  const { data: conversationData } = useQuery({
    queryKey: ["conversation", id],
    queryFn: () =>
      newRequest.get(`/conversations/single/${id}`).then((res) => res.data),
  });

  // Get other user details
  const otherUserId = conversationData?.sellerId === currentUser._id
    ? conversationData?.buyerId
    : conversationData?.sellerId;

  const { data: otherUser } = useQuery({
    queryKey: ["user", otherUserId],
    queryFn: () =>
      newRequest.get(`/users/${otherUserId}`).then((res) => res.data),
    enabled: !!otherUserId,
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
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

        <div className="messages-container">
          {isLoading ? (
            <Loader message="Loading messages..." />
          ) : error ? (
            <div className="error-message">Error loading messages. Please try again.</div>
          ) : (
            <div className="messages-list">
              {data.map((m) => (
                <div
                  className={`message ${m.userId === currentUser._id ? "own" : "other"}`}
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

          {/* <textarea
            placeholder="Write a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          /> */}
          <textarea
            disabled={mutation.isLoading}
            placeholder="Write a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
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
