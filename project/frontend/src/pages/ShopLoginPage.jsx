import React, { useEffect } from "react";
import ShopLogin from "../components/Shop/ShopLogin";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ShopLoginPage = () => {
  const navigate = useNavigate();
  const { isSeller, isLoading } = useSelector((state) => state.seller);

  useEffect(() => {
    console.log("Redux State -> isSeller:", isSeller);
    // console.log("Redux State -> seller:", seller);

    if (isSeller === true) {
      // console.log("Navigating to:", `/shop/${seller._id}`);
      // navigate(`/shop/${seller._id}`);
      navigate("/dashboard");
    }
  }, [isSeller, navigate, isLoading]);

  return (
    <div>
      <ShopLogin />
    </div>
  );
};

export default ShopLoginPage;
