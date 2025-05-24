// import "./app.scss";
// import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
// import React from "react";
// import Navbar from "./components/navbar/Navbar";
// import Footer from "./components/footer/Footer";
// import Home from "./pages/home/Home";
// import Gigs from "./pages/gigs/Gigs";
// import Gig from "./pages/gig/Gig";
// import Login from "./pages/login/Login";
// import Register from "./pages/register/Register";
// import Add from "./pages/add/Add";
// import Orders from "./pages/orders/Orders";
// import Messages from "./pages/messages/Messages";
// import Message from "./pages/message/Message";
// import MyGigs from "./pages/myGigs/MyGigs";
// import {
//   QueryClient,
//   QueryClientProvider,
// } from '@tanstack/react-query'
// import Pay from "./pages/pay/Pay";
// import Success from "./pages/success/Success";

// function App() {

//   const queryClient = new QueryClient();

//   const Layout = () => {
//     return (
//       <div className="app">
//         <QueryClientProvider client={queryClient}>
//           <Navbar />
//           <Outlet />
//           <Footer />
//         </QueryClientProvider>
//       </div>
//     );
//   };

//   const router = createBrowserRouter([
//     {
//       path: "/",
//       element: <Layout />,
//       children: [
//         {
//           path: "/",
//           element: <Home />,
//         },
//         {
//           path: "/gigs",
//           element: <Gigs />,
//         },
//         {
//           path: "/myGigs",
//           element: <MyGigs />,
//         },
//         {
//           path: "/orders",
//           element: <Orders />,
//         },
//         {
//           path: "/messages",
//           element: <Messages />,
//         },
//         {
//           path: "/message/:id",
//           element: <Message />,
//         },
//         {
//           path: "/add",
//           element: <Add />,
//         },
//         {
//           path: "/gig/:id",
//           element: <Gig />,
//         },
//         {
//           path: "/register",
//           element: <Register />,
//         },
//         {
//           path: "/login",
//           element: <Login />,
//         },
//         {
//           path: "/pay/:id",
//           element: <Pay />,
//         },
//         {
//           path: "/success",
//           element: <Success />,
//         },
//       ],
//     },
//   ]);

//   return <RouterProvider router={router} />;
// }

// export default App;
import "./app.scss";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import React from "react";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import Gigs from "./pages/gigs/Gigs";
import Gig from "./pages/gig/Gig";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Add from "./pages/add/Add";
import Orders from "./pages/orders/Orders";
import Messages from "./pages/messages/Messages";
import Message from "./pages/message/Message";
import MyGigs from "./pages/myGigs/MyGigs";
import EditGig from "./pages/EditGig/EditGig";
import About from "./pages/about/About";
import Contact from "./pages/contactUs/Contact";
import Privacy from "./pages/privacy/Privacy";
import Terms from "./pages/TermsOfService/Terms";
import PageNotFound from "./pages/pageNotFound/PageNotFound";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Pay from "./pages/pay/Pay";
import Success from "./pages/success/Success";
import { AuthProvider } from "./context/AuthContext";
import { GigProvider } from "./context/GigContext";
import { OrderProvider } from "./context/OrderContext";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import Profile from "./pages/profile/Profile";
import Loader from "./components/loader/Loader";
import ScrollToTop from "./utils/scrollToTop";

function App() {
  const queryClient = new QueryClient();

  const Layout = () => {
    return (
      <div className="app">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <GigProvider>
              <OrderProvider>
                <ScrollToTop />
                <Navbar />
                <Outlet />
                <Footer />
              </OrderProvider>
            </GigProvider>
          </AuthProvider>
        </QueryClientProvider>
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/gigs",
          element: <Gigs />,
        },
        {
          path: "/myGigs",
          element: (
            <ProtectedRoute>
              <MyGigs />
            </ProtectedRoute>
          ),
        },
        {
          path: "/orders",
          element: (
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          ),
        },
        {
          path: "/messages",
          element: (
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          ),
        },
        {
          path: "/message/:id",
          element: (
            <ProtectedRoute>
              <Message />
            </ProtectedRoute>
          ),
        },
        {
          path: "/add",
          element: (
            <ProtectedRoute>
              <Add />
            </ProtectedRoute>
          ),
        },
        {
          path: "/profile",
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          path: "/gig/:id",
          element: <Gig />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/pay/:id",
          element: (
            <ProtectedRoute>
              <Pay />
            </ProtectedRoute>
          ),
        },
        {
          path: "/success",
          element: (
            <ProtectedRoute>
              <Success />
            </ProtectedRoute>
          ),
        },
        {
          path: "/edit-gig/:id",
          element: (
            <ProtectedRoute>
              <EditGig />
            </ProtectedRoute>
          ),
        },
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/contact",
          element: <Contact />,
        },
        {
          path: "/privacy",
          element: <Privacy />,
        },
        {
          path: "/terms",
          element: <Terms />,
        },
        {
          path: "*",
          element: <PageNotFound />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} fallbackElement={<Loader />} />;
}

export default App;
