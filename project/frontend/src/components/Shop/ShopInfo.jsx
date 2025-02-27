import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { backend_url } from '../../server'
import styles from "../../styles/styles";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../Layout/Loader";
import { getAllProductsShop } from "../../redux/actions/product";

const ShopInfo = ({ isOwner }) => {
    const [data,setData] = useState({});
    const {id} = useParams();
    const [isLoading, setIsLoading] = useState(false);
    

    useEffect(() => {
      setIsLoading(true);
      axios.get(`http://localhost:8000/api/v2/shop/get-shop-info/${id}`).then((res) => {
        setData(res.data.shop);
        setIsLoading(false);
       }).catch((error) => {
         console.log(error);
         setIsLoading(false);
       })

    }, [])


    const logoutHandler = () => {

      axios.get("http://localhost:8000/api/v2/shop/logout",{
        withCredentials: true,
      });
      window.location.reload();

    };

    console.log(data)
  return (
   <>
    
    <div className='w-full py-5'>
        <div className='w-full flex item-center justify-center'>
            <img
                src={`${backend_url}${data?.avatar}`}
                alt=""
                className="w-[150px] h-[150px] object-cover rounded-full"
            />
        </div>
        <h3 className="text-center py-2 text-[20px]">{data.name}</h3>
        <p className="text-[16px] text-[#000000a6] p-[10px] flex items-center">
          {data.description}
        </p>
    </div>
        <div className="p-3">
            <h5 className="font-[600]">Address</h5>
            <h4 className="text-[#000000a6]">{data.address}</h4>
      </div>
      <div className="p-3">
        <h5 className="font-[600]">Phone Number</h5>
        <h4 className="text-[#000000a6]">{data.phoneNumber}</h4>
      </div>
      <div className="p-3">
        <h5 className="font-[600]">Total Products</h5>
        <h4 className="text-[#000000a6]">10</h4>
      </div>
      <div className="p-3">
        <h5 className="font-[600]">Shop Ratings</h5>
        <h4 className="text-[#000000b0]">4/5</h4>
      </div>
      <div className="p-3">
        <h5 className="font-[600]">Joined On</h5>
        <h4 className="text-[#000000b0]">{data?.createdAt?.slice(0, 10)}</h4>
      </div>

      {
        isOwner && (

        <div className="py-3 px-4">
           <Link to="/settings">
           <div className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}>
            <span className="text-white">Edit Shop</span>
          </div>
           </Link>
          <div className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}
          onClick={logoutHandler}
          >
            <span className="text-white">Log Out</span>
          </div>
        </div>

        )
      }
   
   </>
    
  )
}

export default ShopInfo