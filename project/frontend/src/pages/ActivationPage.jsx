import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import { server } from "../server";

const ActivationPage = () => {
  const { activation_token } = useParams();
  const [error, setError] = useState(false);

  useEffect(() => {
  if (activation_token) {
    const activationEmail = async () => {
      try {
        console.log("🚀 Sending Activation Token to Backend:", activation_token);
        const res = await axios.post("http://localhost:8000/api/v2/user/activation", {
          activation_token,
        });

        console.log("✅ Response from Server:", res.data);
      } catch (error) {
        console.error("❌ Activation Error:", error.response?.data || error.message);
        alert(`Error: ${error.response?.data?.message || error.message}`); // Show error in alert
        setError(true);
      }
    };
    activationEmail();
  }
}, [activation_token]);

  
  

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {error ? (
        <p>Your token is expired</p>
      ) : (
        <p>Your account has been created successfully!</p>
      )}
    </div>
  );
};

export default ActivationPage;
