import { Route, Routes } from "react-router-dom";
import AdminViewLayout from "./components/admin-view/layout";
import AdminDashboard from "./pages/admin-view/AdminDashboard";
import AdminHomeFeatures from "./pages/admin-view/AdminHomeFeatures";
import AdminProducts from "./pages/admin-view/products";
import AdminOrders from "./pages/admin-view/AdminOrdersView";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";
import { Skeleton } from "./components/ui/skeleton";
import AuthLogIn from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import AuthLayout from "./components/auth/layout";
import { BASE_URL } from "./config";
import AdminOptions from "./pages/admin-view/AdminOptions";
import AdminAboutPage from "./pages/admin-view/AdminAboutPage";
import AdminProfile from "./pages/admin-view/AdminProfile";
import AdminAddressPage from "./pages/admin-view/AdminAddressPage";
import AdminCouponFormPage from "./pages/admin-view/AdminCouponFormPage";
import AdminContactPage from "./pages/admin-view/AdminContactPage";
import AdminContactQueryViewPage from "./pages/admin-view/AdminContactQueryViewPage";
import WarehouseAdmin from "./pages/admin-view/WarehouseAdmin";
import AdminPrivacyPolicyPage from "./pages/admin-view/AdminPrivacyPolicyPage";
import AdminTermsConditionsPage from "./pages/admin-view/AdminTermsConditionsPage";
import AdminUsers from "./pages/admin-view/AdminUsers";
import AdminFAQPage from "./pages/admin-view/AdminFAQPage";
import AdminCategoryBanners from "./pages/admin-view/AdminCategoryBanners";
import AdminHomeCouponBanner from "./pages/admin-view/AdminHomeCouponBanner";
import DisclaimerManager from "./components/admin-view/DisclaimerManager";

import { Toaster } from "@/components/ui/toaster";
import CheckAuth from "./components/common/checkAuth";
import NotFound from "./pages/not-found";

function App() {
  const { isAuthenticated, user, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  if (isLoading)
    return <Skeleton className={"w-[600px] h-[600px] rounded-full"} />;
  console.log("BASE API URL: ", BASE_URL);
  console.log("User: ", user);
  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        <Route
          path="/"
          element={<CheckAuth isAuthenticated={isAuthenticated} user={user} />}
        />
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogIn />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminViewLayout user={user} />
            </CheckAuth>
          }
        >
          <Route path="profile" element={<AdminProfile user={user} />} />
          <Route path="dashboard" element={<AdminDashboard user={user} />} />
          <Route path="customers" element={<AdminUsers />} />
          {isAuthenticated && user && (
            <Route path="products" element={<AdminProducts />} />
          )}
          <Route path="contactQuery" element={<AdminContactQueryViewPage />} />
          <Route path="warehouse" element={<WarehouseAdmin />} />

          <Route path="features/home" element={<AdminHomeFeatures />} />
          <Route
            path="features/categoryBanners"
            element={<AdminCategoryBanners />}
          />
          <Route path="features/addOptions" element={<AdminOptions />} />
          <Route
            path="features/addressOptions"
            element={<AdminAddressPage />}
          />
          <Route
            path="features/couponManagement"
            element={<AdminCouponFormPage />}
          />
          <Route
            path="features/couponBanner"
            element={<AdminHomeCouponBanner />}
          />
          <Route path="features/disclaimers" element={<DisclaimerManager />} />

          <Route path="orders" element={<AdminOrders />} />
          <Route path="pages/about" element={<AdminAboutPage />} />
          <Route
            path="pages/contactUsManagement"
            element={<AdminContactPage />}
          />
          <Route
            path="pages/privacyPolicy"
            element={<AdminPrivacyPolicyPage />}
          />
          <Route
            path="pages/termsAndCond"
            element={<AdminTermsConditionsPage />}
          />
          <Route path="pages/faqs" element={<AdminFAQPage />} />
        </Route>
        <Route
          path="*"
          element={<NotFound user={user} isAuthenticated={isAuthenticated} />}
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
