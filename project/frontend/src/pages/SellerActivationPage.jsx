import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SellerActivationPage = () => {
  const { activation_token } = useParams();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activation_token) {
      const sendRequest = async () => {
        try {
          console.log("🔹 Activation Token:", activation_token);

          const res = await axios.post(
            "http://localhost:8000/api/v2/shop/activation",
            { activation_token }
          );

          console.log("✅ Activation Successful:", res.data);
          setError(false);
        } catch (err) {
          console.error("❌ Activation Failed:", err.response?.data || err.message);
          setError(true);
        } finally {
          setLoading(false);
        }
      };
      sendRequest();
    }
  }, [activation_token]);

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      {loading ? (
        <p>Activating your account...</p>
      ) : error ? (
        <p style={{ color: "red" }}>❌ Your token is expired or invalid!</p>
      ) : (
        <p style={{ color: "green" }}>✅ Your account has been activated successfully!</p>
      )}
    </div>
  );
};

export default SellerActivationPage;
