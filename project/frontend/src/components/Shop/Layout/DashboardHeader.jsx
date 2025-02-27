import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AiOutlineGift } from "react-icons/ai";
import { MdOutlineLocalOffer } from "react-icons/md";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { BiMessageSquareDetail } from "react-icons/bi";

const DashboardHeader = () => {
  const { seller } = useSelector((state) => state.seller) || {};

  return (
    <div className="w-full h-[80px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
      {/* Logo Section */}
      <div>
        <Link to="/dashboard">
          <img
            src="https://shopo.quomodothemes.website/assets/images/logo.svg"
            alt="Shopo Logo"
          />
        </Link>
      </div>

      {/* Navigation Icons & Profile */}
      <div className="flex items-center">
        <div className="flex items-center mr-4">
          <Link to="/dashboard/cupouns" className="800px:block hidden">
            <AiOutlineGift size={30} className="mx-5 cursor-pointer text-gray-700" />
          </Link>
          <Link to="/dashboard-events" className="800px:block hidden">
            <MdOutlineLocalOffer size={30} className="mx-5 cursor-pointer text-gray-700" />
          </Link>
          <Link to="/dashboard-products" className="800px:block hidden">
            <FiShoppingBag size={30} className="mx-5 cursor-pointer text-gray-700" />
          </Link>
          <Link to="/dashboard-orders" className="800px:block hidden">
            <FiPackage size={30} className="mx-5 cursor-pointer text-gray-700" />
          </Link>
          <Link to="/dashboard-messages" className="800px:block hidden">
            <BiMessageSquareDetail size={30} className="mx-5 cursor-pointer text-gray-700" />
          </Link>

          {/* Seller Profile Image */}
          {seller?._id && (
            <Link to={`/shop/${seller._id}`}>
              <img
                src={seller.avatar?.url || "/default-avatar.png"}
                alt="Seller Avatar"
                className="w-[50px] h-[50px] rounded-full object-cover"
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
