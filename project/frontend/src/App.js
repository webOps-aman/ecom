import React, { useEffect } from "react";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  LoginPage,
  SignupPage,
  ActivationPage,
  HomePage,
  ProductsPage,
  BestSellingPage,
  EventsPage,
  FAQPage,
  ProductDetailsPage,
  ProfilePage,
  ShopCreatePage,
  SellerActivationPage,
  ShopLoginPage,
} from "./routes/Routes.js";

import {ShopDashboardPage, ShopCreateProduct, ShopAllProducts, ShopCreateEvents, ShopAllEvents, ShopAllCoupouns, ShopPreviewPage} from "./routes/ShopRoutes.js";
import Store from "./redux/store.js";
import { loadSeller, loadUser } from "./redux/actions/user.js";
import ProtectedRoute from "./routes/ProtectedRoute.js";
import {ShopHomePage} from "./ShopRoutes.js";
import SellerProtectedRoute from "./routes/SellerProtectedRoute.js";




function App() {


  useEffect(() => {
    Store.dispatch(loadUser());
    Store.dispatch(loadSeller());
  }, []);

  return (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/sign-up" element={<SignupPage />} />
            <Route path="/activation/:activation_token" element={<ActivationPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:name" element={<ProductDetailsPage />} />
            <Route path="/best-selling" element={<BestSellingPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />


            <Route path="/shop-create" element={<ShopCreatePage />} />
            <Route path="/seller/activation/:activation_token" element={<SellerActivationPage />} />
            <Route path="/shop-login" element={<ShopLoginPage />} />
            <Route path="/shop/preview/:id" element={<ShopPreviewPage />} />
            <Route path="/shop/:id" element={
              <SellerProtectedRoute>
                  <ShopHomePage/>
              </SellerProtectedRoute>
              } />
            
            <Route path="/dashboard" element={
              <SellerProtectedRoute>
                  <ShopDashboardPage/>
              </SellerProtectedRoute>
            } />

            <Route path="/dashboard-create-product" element={
              <SellerProtectedRoute>
                  <ShopCreateProduct/>
              </SellerProtectedRoute>
            } />

            <Route path="/dashboard-products" element={
              <SellerProtectedRoute>
                  <ShopAllProducts/>
              </SellerProtectedRoute>
            } />

            <Route path="/dashboard-create-event" element={
              <SellerProtectedRoute>
                  <ShopCreateEvents/>
              </SellerProtectedRoute>
            } />

            <Route path="/dashboard-events" element={
              <SellerProtectedRoute>
                  <ShopAllEvents/>
              </SellerProtectedRoute>
            } />

            <Route path="/dashboard-coupouns" element={
              <SellerProtectedRoute>
                  <ShopAllCoupouns/>
              </SellerProtectedRoute>
            } />

            
          </Routes>

          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </BrowserRouter>
  );
}

export default App;
