import React, { useEffect } from "react";
import ShopLogin from "../components/Shop/ShopLogin";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ShopLoginPage = () => {
  const navigate = useNavigate();
  const { isSeller, seller } = useSelector((state) => state.seller);

  useEffect(() => {
    if (isSeller && seller?._id) {
      navigate(`/shop/${seller._id}`);
    }
  }, [isSeller, seller, navigate]);

  return (
    <div>
      <ShopLogin />
    </div>
  );
};

export default ShopLoginPage;
