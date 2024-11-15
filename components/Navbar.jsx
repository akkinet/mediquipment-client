"use client";
import React, { useState, useEffect, useContext, useRef } from "react";
import Link from "next/link";
import { HoveredLink, Menu, MenuItem } from "./ui/navbar-menu";
import { CiShoppingCart, CiUser, CiSearch } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSession, signOut } from "next-auth/react";
import { DataContext } from "./client/DataContextProvider";
import Cart from "./client/Cart";
import { FaArrowRight } from "react-icons/fa";
import { CartContext } from "./SessionProVider";

const Navbar = () => {
  const [active, setActive] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isSecondaryNavVisible, setIsSecondaryNavVisible] = useState(true); // Initially opened
  const [isUserCardOpen, setIsUserCardOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchDropdownVisible, setIsSearchDropdownVisible] = useState(false);
  const { data: session } = useSession();
  const data = useContext(DataContext);
  const [cartItems, setCartItems] = useContext(CartContext);

  const menuRef = useRef();
  const searchRef = useRef();
  const userCardRef = useRef();
  const cartRef = useRef();

  const toggleSecondaryNav = () => {
    setIsSecondaryNavVisible((prev) => !prev);
  };

  const searchHandler = async (e) => {
    try {
      const val = e.target.value;
      setSearchQuery(val);
      const res = await fetch(`/api/product?query=${val}`);
      const result = await res.json();
      setSearchResults(result);
    } catch (err) {
      console.log(err);
    }
  };

  const signMeOut = () => {
    window.localStorage.clear();
    signOut();
  };

  const handleClickOutside = (event) => {
    if (
      searchRef.current &&
      !searchRef.current.contains(event.target) &&
      isSearchDropdownVisible
    ) {
      setIsSearchDropdownVisible(false);
    }
    if (
      userCardRef.current &&
      !userCardRef.current.contains(event.target) &&
      isUserCardOpen
    ) {
      setIsUserCardOpen(false);
    }
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      isMobileMenuOpen
    ) {
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isSearchDropdownVisible, isUserCardOpen, isMobileMenuOpen]);

  return (
    <div className="fixed top-0 inset-x-0 max-w-full mx-auto z-50">
      {/* Primary Navbar */}
      <div className="flex items-center justify-between backdrop-blur-lg bg-white/30 border border-white/20 shadow-lg py-2 px-4 lg:px-8">
        {/* Logo Section */}
        <div className="flex-1 flex items-center space-x-4 lg:space-x-24">
          <img
            src="https://images.squarespace-cdn.com/content/v1/60aefe75c1a8f258e529fbac/1622081456984-G5MG4OZZJFVIM3R01YN7/jkare-2.png?format=1500w"
            alt="Logo"
            className="h-10"
          />
          <button
            ref={menuRef}
            onClick={toggleSecondaryNav}
            className="lg:block md: hidden relative px-6 py-3 text-white font-semibold bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg hover:from-purple-600 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 blur-md rounded-lg opacity-70 animate-pulse"></span>
            <span className="relative z-10">Menu</span>
          </button>
        </div>

        {/* Center Section */}
        <div className="hidden lg:flex justify-center items-center ">
          <span className="text-gray-700 text-lg lg:text-md  font-semibold">
            Questions? Call Us Toll-free{" "}
            <span className="text-blue-500 font-bold">1-800-567-000</span>
          </span>

        </div>

        {/* Right Section */}
        <div className="flex-1 flex items-center justify-end space-x-4">
          {/* Search */}
          <div className="relative z-50" ref={searchRef}>
            <input
              type="text"
              placeholder="Search Jkare"
              value={searchQuery}
              onChange={searchHandler}
              onFocus={() => setIsSearchDropdownVisible(true)}
              className="block w-64 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <CiSearch size={20} className="text-gray-400" />
            </span>
            {isSearchDropdownVisible && (
              <div className="absolute top-16 right-0 w-64 bg-white shadow-lg rounded-lg p-4 z-50">
                <div className="max-h-60 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    <ul className="list-none p-0">
                      {searchResults.map((item) => (
                        <Link
                          href={`/product/${item.prod_id}`}
                          key={item.prod_id}
                          className="flex items-center p-2 border-b border-gray-200 hover:bg-blue-100 rounded-md transition"
                          onClick={() => setIsSearchDropdownVisible(false)}
                        >
                          <img
                            src={item.prod_images[0]}
                            alt={item.prod_name}
                            className="w-10 h-10 rounded-md object-cover mr-3"
                          />
                          <span className="text-gray-800">{item.prod_name}</span>
                        </Link>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-gray-500 text-center">No items found</div>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* Cart */}
          <div className="relative">
            <CiShoppingCart
              size={30}
              onClick={(e) => {
                e.stopPropagation();
                setIsCartOpen(!isCartOpen);
              }}
            />
            {cartItems > 0 && (
              <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white
               bg-red-500 rounded-full">
                {cartItems}
              </span>
            )}
            {isCartOpen && <Cart isCartOpen={isCartOpen} authSession={session} />}
          </div>

          {/* User */}
          <div className="lg:block md: hidden">
            {session && session.user ? (
              <div className="relative" ref={userCardRef}>
                <div
                  className="cursor-pointer flex items-center"
                  onClick={() => setIsUserCardOpen(!isUserCardOpen)}
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <CgProfile size={30} />
                  )}
                </div>
                {isUserCardOpen && (
                  <div className="absolute top-14 right-2 w-50 bg-white shadow-lg rounded-lg p-4 z-50 border-2 border-gray-200">
                    <p className="font-semibold">{session.user.name}</p>
                    <p className="text-sm text-gray-600">{session.user.email}</p>
                    {session.provider === "credentials" && (
                      <p className="text-md text-gray-600">
                        <Link href="/profile-detail">
                          <button className="mt-2 w-full bg-customBlue focus-visible:bg-customBaseBlue text-white py-1 px-2 rounded">
                            Edit Profile
                          </button>
                        </Link>
                      </p>
                    )}
                    <button
                      onClick={signMeOut}
                      className="mt-2 w-full bg-customBlue focus-visible:bg-customBaseBlue text-white py-1 px-2 rounded"
                    >
                      Sign Out
                    </button>
                    <Link href="/order-history">
                      <button className="mt-2 w-full bg-customBlue focus-visible:bg-customBaseBlue text-white py-1 px-2 rounded">
                        Order History
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="flex items-center space-x-1">
                <CiUser size={24} />
                <span className="text-gray-700">Sign In</span>
              </Link>
            )}
          </div>

          {/* Hamburger Menu */}
          <GiHamburgerMenu
            size={30}
            className="lg:hidden cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          ref={menuRef}
          className="absolute top-14 inset-x-0 py-2 md:px-8 transition transform origin-top-right lg:hidden"
        >
          <div className="rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
            <div className="px-5 flex items-center justify-between">
              <div className="-mr-2">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Home
              </Link>
              <button
                onClick={() =>
                  setIsProductsDropdownOpen(!isProductsDropdownOpen)
                }
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Products
                <svg
                  className="ml-2 inline-block h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={
                      isProductsDropdownOpen
                        ? "M19 9l-7 7-7-7"
                        : "M9 5l7 7-7 7"
                    }
                  />
                </svg>
              </button>
              {isProductsDropdownOpen && (
                <div className="pl-6 space-y-1">
                  {data.map((d) => (
                    <Link
                      key={d.name}
                      href={`/category/${d.name}`}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    >
                      {d.name}
                    </Link>
                  ))}
                  <div className="pl-3 space-y-1 flex items-center">
                    <HoveredLink href="/category">
                      <div className="text-md pr-2 text-customBlue">
                        Shop All
                      </div>
                    </HoveredLink>
                    <div>
                      <FaArrowRight className="text-customBlue" size={14} />
                    </div>
                  </div>
                </div>
              )}
              <Link
                href="/about-us"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                About Us
              </Link>
              <Link
                href="/blog"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Blog
              </Link>
              <Link
                href="/contact-us"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Contact Us
              </Link>
              {session && session.user ? (
                <div className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                  <Link href="/profile-detail">{session.user.name}</Link>
                  <p className="text-sm text-gray-600">{session.user.email}</p>
                  <div className="flex gap-4 w-full items-center">
                    {/* Wrapper for all buttons */}
                    <div className="flex gap-4 w-full">
                      {session.provider === "credentials" && (
                        <Link href="/profile-detail" className="flex-1">
                          <button className="w-full bg-customBlue hover:bg-customPink focus-visible:bg-customBaseBlue text-white py-1 px-2 rounded">
                            Edit Profile
                          </button>
                        </Link>
                      )}
                      <Link href="/order-history" className="flex-1">
                        <button className="w-full bg-customBlue hover:bg-customPink text-white py-1 px-2 rounded">
                          Order History
                        </button>
                      </Link>
                      <button
                        onClick={signMeOut}
                        className="w-full bg-customBlue hover:bg-customPink text-white py-1 px-2 rounded flex-1"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>

                </div>
              ) : (
                <Link href="/login">
                  <div className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                    Login
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Secondary Navbar */}
      <div className="lg:block md: hidden">
        {isSecondaryNavVisible && (
          <div className="py-4 " ref={cartRef}>
            <div className="flex items-center max-w-[86rem]  mx-auto px-4">
              <div className="flex items-center space-x-6 text-white font-semibold text-sm bg-customBlue px-4 rounded-3xl">
                <Menu setActive={setActive}>
                  <Link href="/">
                    <MenuItem setActive={setActive} active={active} item="Home" />
                  </Link>
                  <MenuItem setActive={setActive} active={active} item="Products">
                    <div className="flex flex-col space-y-3 text-md">
                      <>
                        {data.map((d) => (
                          <HoveredLink key={d.name} href={`/category/${d.name}`}>
                            {d.name}
                          </HoveredLink>
                        ))}
                        <div className="flex items-center space-y-1">
                          <HoveredLink href="/category">
                            <div className="text-md pr-2 font-bold text-black hover:text-customPink">
                              Shop All
                            </div>
                          </HoveredLink>
                          <div>
                            <FaArrowRight
                              className="text-black hover:text-customPink animate-pulse"
                              size={18}
                            />
                          </div>
                        </div>
                      </>
                    </div>
                  </MenuItem>
                  <Link href="/about-us">
                    <MenuItem setActive={setActive} active={active} item="About Us" />
                  </Link>
                  <Link href="/">
                    <MenuItem setActive={setActive} active={active} item="Services" />
                  </Link>
                  <Link href="/">
                    <MenuItem setActive={setActive} active={active} item="Patient Resources" />
                  </Link>
                  <Link href="/">
                    <MenuItem setActive={setActive} active={active} item="Why JKare" />
                  </Link>
                  <Link href="/blog">
                    <MenuItem setActive={setActive} active={active} item="Blog" />
                  </Link>
                  <Link href="/contact-us">
                    <MenuItem setActive={setActive} active={active} item="Contact Us" />
                  </Link>
                </Menu>
              </div>
              {/* <div className="flex items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCartOpen(!isCartOpen);
                }}
                className="relative flex items-center text-white focus:outline-none"
              >
                <CiShoppingCart size={34} className="text-black lg:mr-24" />
                {cartItems > 0 && (
                  <span className="absolute left-3 bottom-3 inline-flex items-center justify-center px-2 py-1 text-xs font-normal leading-none text-white bg-red-500 rounded-full">
                    {cartItems}
                  </span>
                )}
              </button>
              {isCartOpen && <Cart isCartOpen={isCartOpen} authSession={session} />}
            </div> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
