/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";

// import { Route, Routes } from "react-router-dom";
// import AdminViewLayout from "./components/admin-view/layout";
// import AdminDashboard from "./pages/admin-view/AdminDashboard";
// import AdminHomeFeatures from "./pages/admin-view/AdminHomeFeatures";
// import AdminProducts from "./pages/admin-view/products";
// import AdminOrders from "./pages/admin-view/AdminOrdersView";

// import { useDispatch, useSelector } from "react-redux";
// import { useEffect } from "react";
// import { checkAuth } from "./store/auth-slice";
// import { Skeleton } from "./components/ui/skeleton";
// import AuthLogIn from "./pages/auth/login";
// import AuthRegister from "./pages/auth/register";
// import AuthLayout from "./components/auth/layout";
// import { BASE_URL } from "./config";
// import AdminOptions from "./pages/admin-view/AdminOptions";
// import AdminAboutPage from "./pages/admin-view/AdminAboutPage";
// import AdminProfile from "./pages/admin-view/AdminProfile";
// import AdminAddressPage from "./pages/admin-view/AdminAddressPage";
// import AdminCouponFormPage from "./pages/admin-view/AdminCouponFormPage";
// import AdminContactPage from "./pages/admin-view/AdminContactPage";
// import AdminContactQueryViewPage from "./pages/admin-view/AdminContactQueryViewPage";
// import WarehouseAdmin from "./pages/admin-view/WarehouseAdmin";
// import AdminPrivacyPolicyPage from "./pages/admin-view/AdminPrivacyPolicyPage";
// import AdminTermsConditionsPage from "./pages/admin-view/AdminTermsConditionsPage";
// import AdminUsers from "./pages/admin-view/AdminUsers";
// import AdminFAQPage from "./pages/admin-view/AdminFAQPage";
// import AdminCategoryBanners from "./pages/admin-view/AdminCategoryBanners";
// import AdminHomeCouponBanner from "./pages/admin-view/AdminHomeCouponBanner";
// import DisclaimerManager from "./components/admin-view/DisclaimerManager";

// import { Toaster } from "@/components/ui/toaster";
// import CheckAuth from "./components/common/checkAuth";
// import NotFound from "./pages/not-found";

// function App() {
//   const { isAuthenticated, user, isLoading } = useSelector(
//     (state) => state.auth
//   );
//   const dispatch = useDispatch();
//   useEffect(() => {
//     dispatch(checkAuth());
//   }, [dispatch]);
//   if (isLoading)
//     return <Skeleton className={"w-[600px] h-[600px] rounded-full"} />;
//   console.log("BASE API URL: ", BASE_URL);
//   console.log("User: ", user);
//   return (
//     <div className="flex flex-col overflow-hidden bg-white">
//       <Routes>
//         <Route
//           path="/"
//           element={<CheckAuth isAuthenticated={isAuthenticated} user={user} />}
//         />
//         <Route
//           path="/auth"
//           element={
//             <CheckAuth isAuthenticated={isAuthenticated} user={user}>
//               <AuthLayout />
//             </CheckAuth>
//           }
//         >
//           <Route path="login" element={<AuthLogIn />} />
//           <Route path="register" element={<AuthRegister />} />
//         </Route>
//         <Route
//           path="/admin"
//           element={
//             <CheckAuth isAuthenticated={isAuthenticated} user={user}>
//               <AdminViewLayout user={user} />
//             </CheckAuth>
//           }
//         >
//           <Route path="profile" element={<AdminProfile user={user} />} />
//           <Route path="dashboard" element={<AdminDashboard user={user} />} />
//           <Route path="customers" element={<AdminUsers />} />
//           {isAuthenticated && user && (
//             <Route path="products" element={<AdminProducts />} />
//           )}
//           <Route path="contactQuery" element={<AdminContactQueryViewPage />} />
//           <Route path="warehouse" element={<WarehouseAdmin />} />

//           <Route path="features/home" element={<AdminHomeFeatures />} />
//           <Route
//             path="features/categoryBanners"
//             element={<AdminCategoryBanners />}
//           />
//           <Route path="features/addOptions" element={<AdminOptions />} />
//           <Route
//             path="features/addressOptions"
//             element={<AdminAddressPage />}
//           />
//           <Route
//             path="features/couponManagement"
//             element={<AdminCouponFormPage />}
//           />
//           <Route
//             path="features/couponBanner"
//             element={<AdminHomeCouponBanner />}
//           />
//           <Route path="features/disclaimers" element={<DisclaimerManager />} />

//           <Route path="orders" element={<AdminOrders />} />
//           <Route path="pages/about" element={<AdminAboutPage />} />
//           <Route
//             path="pages/contactUsManagement"
//             element={<AdminContactPage />}
//           />
//           <Route
//             path="pages/privacyPolicy"
//             element={<AdminPrivacyPolicyPage />}
//           />
//           <Route
//             path="pages/termsAndCond"
//             element={<AdminTermsConditionsPage />}
//           />
//           <Route path="pages/faqs" element={<AdminFAQPage />} />
//         </Route>
//         <Route
//           path="*"
//           element={<NotFound user={user} isAuthenticated={isAuthenticated} />}
//         />
//       </Routes>
//       <Toaster />
//     </div>
//   );
// }

// export default App;

export default function App() {
  const [showModal, setShowModal] = useState(false);

  const handleContactClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

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
          onClick={handleContactClick}
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

      {/* Modal Popup */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center px-4 z-50"
          onClick={handleCloseModal}
        >
          {/* Modal Content */}
          <div
            className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <div className="sticky top-0 flex justify-end p-4 bg-gray-50 border-b">
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 text-center">
              {/* Image */}
              <div className="mb-8">
                <img
                  src="/image.png"
                  alt="Developer"
                  className="w-full h-auto rounded-lg shadow-md object-contain"
                />
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-800">
                  Payment Not Found 😂
                </h2>

                <p className="text-gray-600 leading-relaxed">
                  The payment is still playing hide and seek with the developer!
                </p>

                <div className="bg-red-50 border-l-4 border-red-500 p-4 text-left">
                  <p className="text-sm text-red-700 font-semibold">
                    Developer Contact Information:
                  </p>
                  <p className="text-sm text-red-600 mt-2">
                    Email: developer@onuclothing.com
                  </p>
                  <p className="text-sm text-red-600">
                    Status: Still Debugging... 🔧
                  </p>
                </div>

                <p className="text-xs text-gray-500 italic">
                  Come back later or send a coffee ☕ to speed up the process!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
