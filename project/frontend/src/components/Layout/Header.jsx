import React, { useState, useEffect } from 'react';
import styles from "../../styles/styles";
import { Link } from 'react-router-dom';
import NextCart from "../../Assests/NextCart.jpg";
import { categoriesData, productData } from "../../static/data";
import {
    AiOutlineHeart,
    AiOutlineSearch,
    AiOutlineShoppingCart,
} from "react-icons/ai";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import DropDown from "./DropDown";
import Navbar from "./Navbar";
import { CgProfile } from "react-icons/cg";
import { useSelector } from "react-redux";
import { backend_url } from '../../server';
import Cart from "../cart/Cart";
import Wishlist from "../Wishlist/Wishlist";

const Header = ({ activeHeading }) => {
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchData, setSearchData] = useState(null);
    const [active, setActive] = useState(false);
    const [dropDown, setDropDown] = useState(false);
    const [openCart, setOpenCart] = useState(false);
    const [openWishlist, setOpenWishlist] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setActive(window.scrollY > 70);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        if (term.trim() === "") {
            setSearchData(null);
            return;
        }

        const filteredProducts = productData.filter((product) =>
            product.name.toLowerCase().includes(term.toLowerCase())
        );
        setSearchData(filteredProducts);
    };

    return (
        <>
            {/* Top Header */}
            <div className={`${styles.section}`}>
                <div className="hidden 800px:h-[50px] 800px:my-[20px] 800px:flex items-center justify-between">
                    <div className="w-60">
                        <Link to="/">
                            <img src={NextCart} alt="Logo" />
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="w-[50%] relative">
                        <input
                            type="text"
                            placeholder="Search Product..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="h-[40px] w-full px-2 border-[#3957db] border-[2px] rounded-md"
                        />
                        <AiOutlineSearch size={30} className="absolute right-2 top-1.5 cursor-pointer" />
                        {searchData && searchData.length > 0 && (
                            <div className="absolute min-h-[30vh] bg-slate-50 shadow-sm-2 z-[9] p-4 w-full">
                                {searchData.map((i, index) => (
                                    <Link to={`/product/${i._id}`} key={index}>
                                        <div className="w-full flex items-start py-3">
                                            <img
                                                src={i.image_Url[0].url}
                                                alt={i.name}
                                                className="w-[40px] h-[40px] mr-[10px]"
                                            />
                                            <h1>{i.name}</h1>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Become Seller Button */}
                    <div className={`${styles.button}`}>
                        <Link to="/seller">
                            <h1 className="text-[#fff] flex items-center">
                                Become Seller <IoIosArrowForward className='ml-1' />
                            </h1>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Navbar Section */}
            <div className={`${active ? "shadow-sm fixed top-0 left-0 z-10" : ""} transition hidden 800px:flex items-center justify-between w-full bg-[#3321c8] h-[70px]`}>
                <div className={`${styles.section} relative ${styles.noramlFlex} justify-between`}>
                    
                    {/* Categories Dropdown */}
                    <div className="relative h-[60px] mt-[10px] w-[270px] hidden 1000px:block">
                        <BiMenuAltLeft size={30} className="absolute top-3 left-2" />
                        <button
                            className="h-[100%] w-full flex justify-between items-center pl-10 bg-white font-sans text-lg font-[500] select-none rounded-t-md"
                            onClick={() => setDropDown(!dropDown)}
                        >
                            All Categories
                        </button>
                        <IoIosArrowDown
                            size={20}
                            className="absolute right-2 top-4 cursor-pointer"
                            onClick={() => setDropDown(!dropDown)}
                        />
                        {dropDown && <DropDown categoriesData={categoriesData} setDropDown={setDropDown} />}
                    </div>

                    {/* Navbar Links */}
                    <Navbar active={activeHeading} />

                    {/* Icons Section */}
                    <div className="flex">
                        {/* Wishlist */}
                        <div className="relative cursor-pointer mr-[15px]"  onClick={() => setOpenWishlist(true)}>
                            <AiOutlineHeart size={30} color="rgb(255 255 255 / 83%)" />
                            <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 text-white text-[12px] text-center">0</span>
                        </div>

                        {/* Cart */}
                        <div className="relative cursor-pointer mr-[15px]" onClick={() => setOpenCart(true)}>
                            <AiOutlineShoppingCart size={30} color="rgb(255 255 255 / 83%)" />
                            <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 text-white text-[12px] text-center">1</span>
                        </div>

                        {/* Profile */}
                        <div className="relative cursor-pointer mr-[15px]">
                            {isAuthenticated ? (
                                <Link to="/profile">
                                    <img
                                        src={`${backend_url}${user.avatar}`}
                                        className="w-[35px] h-[35px] rounded-full"
                                        alt="Profile"
                                    />
                                </Link>
                            ) : (
                                <Link to="/login">
                                    <CgProfile size={30} color="rgb(255 255 255 / 83%)" />
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* cart popup */}
                    {openCart ? <Cart setOpenCart={setOpenCart} /> : null}

                    {/* wishlist popup */}
                    {openWishlist ? (
                    <Wishlist setOpenWishlist={setOpenWishlist} />
                    ) : null}
                </div>
            </div>
        </>
    );
};

export default Header;
