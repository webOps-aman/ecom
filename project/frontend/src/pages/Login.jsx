import React, { useEffect } from 'react'
import Login from "../components/Login/Login.jsx";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';


const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if(isAuthenticated === true){
      navigate("/");
      window.location.reload(true);
    }
  }, [])

  return (
    <div className='w-full h-screen bg-gray-50'>
        <Login/>
    </div>
  )
}

export default LoginPage