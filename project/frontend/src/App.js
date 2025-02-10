import React, { useEffect } from "react";
import "./App.css";
import { ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import {LoginPage, SignupPage, ActivationPage} from "./routes/Routes.js";
import Store from "./redux/store.js";
import { loadUser } from "./redux/actions/user.js";



function App() {


  useEffect(() => {
    Store.dispatch(loadUser());
  }, [])


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/sign-up" element={<SignupPage/>} />
        <Route path="/activation/:activation_token" element={<ActivationPage/>} />
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
