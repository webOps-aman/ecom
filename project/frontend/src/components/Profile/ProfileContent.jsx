import React, { useState } from "react";
import {
    AiOutlineAim,
  AiOutlineArrowRight,
  AiOutlineCamera,
  AiOutlineDelete
} from "react-icons/ai";
import styles from "../../styles/styles";
import { backend_url } from "../../server";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Country, State } from "country-state-city";




const ProfileContent = ({ active }) => {
  const { user } = useSelector((state) => state.user);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [zipCode, setZipCode] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Profile Updated:", { name, email, phoneNumber, zipCode, address1, address2 });
  };

  return (
    <div className="w-full">
      {active === 1 && (
        <>
          <div className="flex justify-center w-full">
            <div className="relative">
              <img
                src={`${backend_url}${user?.avatar}`}
                alt="Profile"
                className="w-[150px] h-[150px] rounded-full object-cover border-[3px] border-[#3ad132]"
              />
              <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] right-[5px]">
                <input type="file" id="image" className="hidden" />
                <label htmlFor="image">
                  <AiOutlineCamera />
                </label>
              </div>
            </div>
          </div>
          <br />
          <div className="w-full px-5">
            <form onSubmit={handleSubmit}>
              <div className="w-full flex flex-wrap pb-3">
                <div className="w-full md:w-1/2 pr-2">
                  <label className="block pb-2">Full Name</label>
                  <input
                    type="text"
                    className={`${styles.input} w-full`}
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-1/2 pl-2">
                  <label className="block pb-2">Email Address</label>
                  <input
                    type="email"
                    className={`${styles.input} w-full`}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full flex flex-wrap pb-3">
                <div className="w-full md:w-1/2 pr-2">
                  <label className="block pb-2">Phone Number</label>
                  <input
                    type="number"
                    className={`${styles.input} w-full`}
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-1/2 pl-2">
                  <label className="block pb-2">Zip Code</label>
                  <input
                    type="text"
                    className={`${styles.input} w-full`}
                    required
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full flex flex-wrap pb-3">
                <div className="w-full md:w-1/2 pr-2">
                  <label className="block pb-2">Address 1</label>
                  <input
                    type="text"
                    className={`${styles.input} w-full`}
                    required
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-1/2 pl-2">
                  <label className="block pb-2">Address 2</label>
                  <input
                    type="text"
                    className={`${styles.input} w-full`}
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-[250px] h-[40px] border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] mt-8 cursor-pointer"
              >
                Update
              </button>
            </form>
          </div>
        </>
      )}

      {/* order */}
      {active === 2 && <AllOrders />}

      {/* Refund */}
      {active === 3 && <AllRefundOrders />}

      {/* Track order */}
      {active === 5 && <TrackOrder />}

      {/* PaymentMethod */}
      {active === 6 && <PaymentMethod />}

      {/*  user Address */}
      {active === 7 && <Address />}


    </div>
  );
};

const AllOrders = () => {
  const orders = [
    {
      _id: "7463hvbfbhfbrtr28820221",
      orderItems: [{ name: "iPhone 14 Pro Max" }],
      totalPrice: 120,
      orderStatus: "Processing",
    },
  ];

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 200, flex: 1 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.8,
      cellClassName: (params) =>
        params.value === "Delivered" ? "text-green-500" : "text-red-500",
    },
    { field: "itemsQty", headerName: "Items Qty", type: "number", minWidth: 150, flex: 0.5 },
    { field: "total", headerName: "Total Price", type: "number", minWidth: 150, flex: 0.7 },
    {
      field: "action",
      headerName: "Action",
      minWidth: 150,
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <Link to={`/user/order/${params.id}`}>
          <Button>
            <AiOutlineArrowRight size={20} />
          </Button>
        </Link>
      ),
    },
  ];

  const rows = orders.map((order) => ({
    id: order._id,
    itemsQty: order.orderItems.length,
    total: `$${order.totalPrice}`,
    status: order.orderStatus,
  }));

  return (
    <div className="p-8">
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        autoHeight
        disableSelectionOnClick
      />
    </div>
  );
};


const AllRefundOrders = () => {

    const orders = [
        {
          _id: "7463hvbfbhfbrtr28820221",
          orderItems: [{ name: "iPhone 14 Pro Max" }],
          totalPrice: 120,
          orderStatus: "Processing",
        },
      ];

      const columns = [
        { field: "id", headerName: "Order ID", minWidth: 200, flex: 1 },
        {
          field: "status",
          headerName: "Status",
          minWidth: 150,
          flex: 0.8,
          cellClassName: (params) =>
            params.value === "Delivered" ? "text-green-500" : "text-red-500",
        },
        { field: "itemsQty", headerName: "Items Qty", type: "number", minWidth: 150, flex: 0.5 },
        { field: "total", headerName: "Total Price", type: "number", minWidth: 150, flex: 0.7 },
        {
          field: "action",
          headerName: "Action",
          minWidth: 150,
          flex: 0.5,
          sortable: false,
          renderCell: (params) => (
            <Link to={`/user/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          ),
        },
      ];

      const rows = orders.map((order) => ({
        id: order._id,
        itemsQty: order.orderItems.length,
        total: `$${order.totalPrice}`,
        status: order.orderStatus,
      }));

    return (
        <div className="p-8">
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                autoHeight
                disableSelectionOnClick
            />
    </div>
    )
};


const TrackOrder = () => {
    const orders = [
        {
          _id: "7463hvbfbhfbrtr28820221",
          orderItems: [{ name: "iPhone 14 Pro Max" }],
          totalPrice: 120,
          orderStatus: "Processing",
        },
      ];

      const columns = [
        { field: "id", headerName: "Order ID", minWidth: 200, flex: 1 },
        {
          field: "status",
          headerName: "Status",
          minWidth: 150,
          flex: 0.8,
          cellClassName: (params) =>
            params.value === "Delivered" ? "text-green-500" : "text-red-500",
        },
        { field: "itemsQty", headerName: "Items Qty", type: "number", minWidth: 150, flex: 0.5 },
        { field: "total", headerName: "Total Price", type: "number", minWidth: 150, flex: 0.7 },
        {
          field: "action",
          headerName: "Action",
          minWidth: 150,
          flex: 0.5,
          sortable: false,
          renderCell: (params) => (
            <Link to={`/user/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          ),
        },
      ];

      const rows = orders.map((order) => ({
        id: order._id,
        itemsQty: order.orderItems.length,
        total: `$${order.totalPrice}`,
        status: order.orderStatus,
      }));

    return (
        <div className="p-8">
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                autoHeight
                disableSelectionOnClick
            />
    </div>
    )
};


const PaymentMethod = () => {
    return (
        <div className="w-full px-5">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-[25px] font-[600] text-[#000] pb-2">Payment Methods</h1>
                <div className={`${styles.button} rounded-md`}>
                    <span className="text-[#fff]">Add New</span>
                </div> 
            </div>
            <br/>
            <div className="w-full bg-white h-[70px] rounded-[4px] flex items-center px-3 shadow justify-between pr-10">
                <div className="flex items-center">
                    <img
                    src="https://bonik-react.vercel.app/assets/images/payment-methods/Visa.svg"
                    alt=""
                    />
                    <h5 className="pl-5 font-[600]">Amandeep Singh</h5>
                </div>
                <div className="pl-8 flex items-center">
                    <h6>4065 **** *** ***</h6>
                    <h5 className="pl-6">08/2027</h5>
                </div>
                <div className="min-w-[10%] flex items-center justify-between pl-8">
                    <AiOutlineDelete size={25} className="cursor-pointer"/>
                </div>
            </div>
        </div>
    )
};



const Address = () => {
    
    return (

        <div className="w-full px-5">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-[25px] font-[600] text-[#000] pb-2">My Address</h1>
                <div className={`${styles.button} rounded-md`}>
                    <span className="text-[#fff]">Add New</span>
                </div> 
            </div>
            <br/>
            <div className="w-full bg-white h-[70px] rounded-[4px] flex items-center px-3 shadow justify-between pr-10">
                <div className="flex items-center">
                    <h5 className="pl-5 font-[600]">Default Address</h5>
                </div>
                <div className="pl-8 flex items-center">
                    <h6>Tilak Nagar, New Delhi</h6>
                </div>
                <div className="pl-8 flex items-center">
                    <h6>9874568520</h6>
                </div>
                <div className="min-w-[10%] flex items-center justify-between pl-8">
                    <AiOutlineDelete size={25} className="cursor-pointer"/>
                </div>
            </div>
        </div>
    )
}

export default ProfileContent;
