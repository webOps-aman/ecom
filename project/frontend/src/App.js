import React, { useEffect } from "react";
import "./App.css";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {BrowserRouter, Routes, Route} from "react-router-dom"
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
    
import Store from "./redux/store.js";
import { loadUser } from "./redux/actions/user.js";
import { useSelector } from "react-redux";
import ProtectedRoute from "./ProtectedRoute.js";


function App() {
  const { loading, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    Store.dispatch(loadUser());
  }, [])


  return (
    <>
      {
        loading ? (
          null
        ) : (
          <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/sign-up" element={<SignupPage/>} />
        <Route path="/activation/:activation_token" element={<ActivationPage/>} />
        <Route path="/products" element={<ProductsPage/>} />
        <Route path="/product/:name" element={<ProductDetailsPage/>} />
        <Route path="/best-selling" element={<BestSellingPage/>} />
        <Route path="/events" element={<EventsPage/>} />
        <Route path="/faq" element={<FAQPage/>} />
        <Route path="/profile" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <ProfilePage/>
          </ProtectedRoute>
        } />
        <Route path="/shop-create" element={<ShopCreatePage/>} />
        <Route path="/seller/activation/:activation_token" element={<SellerActivationPage/>} />
        <Route path="/shop-login" element={<ShopLoginPage/>} />

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
        )
      }
    </>
  );
}

export default App;
