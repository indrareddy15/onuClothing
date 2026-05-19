// ============================================
// IMPORTS - ALL COMMENTED OUT
// ============================================

// import {
//   BrowserRouter as Router,
//   Route,
//   Routes,
//   Navigate,
//   useLocation,
// } from "react-router-dom";
// import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import "./App.css";
// import Navbar from "./components/Navbar/Navbar";
// import Home from "./components/Home/Home";
// import Login from "./components/Login/Login";
// import Otpverify from "./components/Login/otpverify";
// import Registeruser from "./components/Login/Registeruser";
// import Overview from "./components/Login/Dashboard/overview";
// import Allproductpage from "./components/Product/Allproduct";
// import Ppage from "./components/Productpage/Ppage";
// import MPpage from "./components/Productpage/MPpage";
// import Wishlist from "./components/Wishlist/Wishlist";
// import Bag from "./components/Bag/Bag";
// import Address from "./components/Bag/Address";
// import "react-lazy-load-image-component/src/effects/blur.css";
// import { BASE_API_URL } from "./config/index";
// import About from "./components/Website_HelpSupport/About";
// import Contact from "./components/Website_HelpSupport/Contact";
// import OrderDetailsPage from "./components/Login/Dashboard/OrderDetailsPage";
// import FAQ from "./components/Website_HelpSupport/FAQ";
// import TermsAndConditions from "./components/Website_HelpSupport/TermsAndConditions";
// import PrivacyPolicy from "./components/Website_HelpSupport/PrivacyPolicy";
// import ReturnRefundPolicy from "./components/Website_HelpSupport/ReturnRefundPolicy";
// import { Toaster } from "./components/ui/toaster";
// import CheckoutPage from "./components/Bag/NewCheckoutPage";
// import NotFoundPage from "./NotFoundPage";
// import PaymentSuccess from "./components/Bag/PaymentSuccess";
// import PaymentFailed from "./components/Bag/PaymentFailed";
// import PaymentPending from "./components/Bag/PaymentPending";
// import ScrollToTop from "./components/ScrollToTop";
// import { useServerAuth } from "./Contaxt/AuthContext";
// import axios from "axios";

// ============================================
// CUSTOM HOOK - COMMENTED OUT
// ============================================

// const useWindowSize = () => {
//   const [windowSize, setWindowSize] = useState({
//     width: window.innerWidth,
//     height: window.innerHeight,
//   });

//   useEffect(() => {
//     const handleResize = () => {
//       setWindowSize({ width: window.innerWidth, height: window.innerHeight });
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return windowSize;
// };

// ============================================
// MAIN APP COMPONENT - COMMENTED OUT
// ============================================

// function App() {
//   const dispatch = useDispatch();
//   const { width } = useWindowSize();
//   const { userLoading, user, isAuthentication, checkAuthUser } =
//     useServerAuth();

//   const [state, setstate] = useState(false);

//   // EFFECT HOOK - Handles authentication check and URL validation
//   useEffect(() => {
//     if (state === false) {
//       checkAuthUser();
//       setstate(true);
//     }
//     let url = document.URL;
//     if (url.includes("&")) {
//       if (!url.includes("?")) {
//         let url1 = url.replace("&", "?");
//         window.location = url1;
//       }
//     }
//     if (isAuthentication) {
//       if (
//         url ===
//         window.location.protocol + "//" + window.location.host + "/Login"
//       ) {
//         window.location.href =
//           window.location.protocol + "//" + window.location.host;
//       }
//       if (
//         url ===
//         window.location.protocol + "//" + window.location.host + "/verifying"
//       ) {
//         window.location.href =
//           window.location.protocol + "//" + window.location.host;
//       }
//       if (
//         url ===
//         window.location.protocol + "//" + window.location.host + "/registeruser"
//       ) {
//         window.location.href =
//           window.location.protocol + "//" + window.location.host;
//       }
//     }
//   }, [dispatch, isAuthentication]);
//   console.log("Base Server API: ", BASE_API_URL);

//   const isMobile = width < 1024;

//   // RENDER - Router with all page routes configured
//   return (
//     <Router>
//       <ScrollToTop />
//       <Navbar />
//       <Routes>
//         {/* Public Routes */}
//         <Route path="/" element={<Home user={user} />} />
//         <Route path="/Login" element={<Login />} />
//         <Route path="/verifying" element={<Otpverify />} />
//         <Route path="/registeruser" element={<Registeruser />} />

//         {/* Authenticated Routes */}
//         <Route
//           path="/dashboard"
//           element={
//             <Overview
//               user={user}
//               loading={userLoading}
//               isAuthentication={isAuthentication}
//             />
//           }
//         />
//         <Route
//           path="/order/details/:orderId"
//           element={<OrderDetailsPage user={user} />}
//         />
//         {/* Checkout Routes */}
//         <Route path="/my_wishlist" element={<Wishlist />} />
//         <Route path="/bag" element={<Bag user={user} />} />
//         <Route path="/bag/checkout" element={<CheckoutPage />} />
//         <Route path="/bag/checkout/success" element={<PaymentSuccess />} />
//         <Route path="/bag/checkout/failure" element={<PaymentFailed />} />
//         <Route path="/bag/checkout/pending" element={<PaymentPending />} />

//         {/* Address Route */}
//         <Route path="/address/bag" element={<Address user={user} />} />

//         {/* Static Pages */}
//         <Route path="/about" element={<About />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="/faq" element={<FAQ />} />
//         <Route path="/tc" element={<TermsAndConditions />} />
//         <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
//         <Route path="/returnPolicy" element={<ReturnRefundPolicy />} />

//         {/* Product Pages */}
//         <Route path="/products" element={<Allproductpage user={user} />} />
//         <Route
//           path="/products/:id"
//           element={isMobile ? <MPpage /> : <Ppage />}
//         />

//         {/* Catch-All Route */}
//         <Route path="*" element={<NotFoundPage />} />
//       </Routes>
//       {/* <Toaster /> */}
//     </Router>
//   );
// }

// export default App;

// ============================================
// MAINTENANCE MESSAGE - DISPLAYED ON APP LAUNCH
// ============================================

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center justify-center px-4">
      {/* Main Message Container */}
      <div className="max-w-lg w-full text-center">
        {/* Icon/Logo Area */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500 rounded-full mb-6 shadow-lg">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Page Not Found
        </h1>

        {/* Message */}
        <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
          The page or website you're looking for has been deleted.
        </p>

        {/* Subtext */}
        <p className="text-sm md:text-base text-gray-400 mb-8">
          Please contact the Developer for more information or assistance.
        </p>

        {/* Contact Button */}
        <button
          onClick={() => {
            // Developer contact action
            alert(
              "Please contact the Developer for assistance — the payment is still playing hide and seek with the developer 😂",
            );
          }}
          className="inline-block px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
        >
          Contact Developer
        </button>

        {/* Footer Note */}
        <p className="text-xs text-gray-500 mt-8">
          Error Code: 404 | Payment Not Found… Probably Still Loading for the
          Developer 😅
        </p>
      </div>
    </div>
  );
}
