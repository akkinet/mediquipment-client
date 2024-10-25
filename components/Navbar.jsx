"use client";
import React, { useState, useEffect, useContext, useRef } from "react";
import { HoveredLink, Menu, MenuItem } from "./ui/navbar-menu";
import Link from "next/link";
import { CiSearch, CiShoppingCart, CiUser } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { useSession, signOut } from "next-auth/react";
import { FaArrowRight } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { DataContext } from "./client/DataContextProvider";
import Cart from "./client/Cart";
import { CartContext } from "./SessionProVider";

const Navbar = () => {
  const [active, setActive] = useState(null);
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserCardOpen, setIsUserCardOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const data = useContext(DataContext);
  const style = { color: "black" };
  const [cartItems, setCartItems] = useContext(CartContext);

  const menuRef = useRef();
  const searchRef = useRef();
  const userCardRef = useRef();

  // Search Handler - Works regardless of session status
  const searchHandler = async (e) => {
    try {
      const val = e.target.value;
      setSearchQuery(val);

      // Fetch search results from the API
      const res = await fetch(`/api/product?query=${val}`);
      const result = await res.json();
      setSearchResults(result);
    } catch (err) {
      console.log(err);
    }
  };

  // Handle clicking outside the dropdown menus
  useEffect(() => {
    const localCart =
      typeof window !== "undefined" && window.localStorage.getItem("medCart");
    if (localCart) {
      setCartItems(JSON.parse(localCart).length);
    }

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (userCardRef.current && !userCardRef.current.contains(event.target)) {
        setIsUserCardOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const signMeOut = () => {
    window.localStorage.clear();
    signOut();
  };

  const handleMobileMenuItemClick = () => {
    setIsMobileMenuOpen(false);
  };

  // if (status === "loading") {
  //   return <p>Loading...</p>;
  // }

  return (
    <div className="fixed top-0 inset-x-0 max-w-full mx-auto z-50 flex items-center justify-between bg-stone-200/90 backdrop-blur-md lg:px-8 py-2  ">
      <div className="flex items-center sm: pl-4">
        <img
          className="lg:h-14 max-w-sm: h-9 lg:py-2"
          src="https://images.squarespace-cdn.com/content/v1/60aefe75c1a8f258e529fbac/1622081456984-G5MG4OZZJFVIM3R01YN7/jkare-2.png?format=1500w"
          alt="Logo"
        />
      </div>
      <div className="hidden md:flex font-montserrat tracking-tighter">
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
                      Load More
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
          <Link href="/blog">
            <MenuItem setActive={setActive} active={active} item="Blog" />
          </Link>
          <Link href="/contact-us">
            <MenuItem setActive={setActive} active={active} item="Contact Us" />
          </Link>
        </Menu>
      </div>
      <div className="hidden md:flex items-center space-x-4">
        <button onClick={() => setIsSearchOpen(!isSearchOpen)}>
          <CiSearch style={style} size={34} />
        </button>

        <button
          onClick={() => setIsCartOpen(!isCartOpen)}
          className="relative flex items-center text-black focus:outline-none"
        >
          <CiShoppingCart size={32} />
          {cartItems > 0 && (
            <span
              className="absolute left-3 bottom-3 inline-flex items-center justify-center px-2 py-1 text-xs font-normal 
              leading-none text-white bg-customBlue rounded-full"
            >
              {cartItems}
            </span>
          )}
        </button>

        {isCartOpen && <Cart isCartOpen={isCartOpen} authSession={session} />}
        <div className="hidden md:block" ref={userCardRef}>
          {session && session.user ? (
            <div
              className="block lg:mt-0 lg:inline-block text-white font-semibold hover:underline mr-4"
              onClick={() => setIsUserCardOpen(!isUserCardOpen)}
            >
              {session.user?.image ? (
                <img
                  src={String(session?.user?.image)}
                  alt="Profile Photo"
                  className="w-9 h-9 rounded-full mr-2 inline-block"
                />
              ) : (
                <CgProfile size={34} />
              )}
            </div>
          ) : (
            <Link href="/login">
              <CiUser
                className="hover:invert-1"
                style={style}
                filter="invert(0)"
                size={30}
              />
            </Link>
          )}
          {isUserCardOpen && (
            <div className="absolute top-20 right-2 w-50 bg-white shadow-lg rounded-lg p-4 z-50 border-2 border-gray-200">
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
      </div>
      <div className="flex md:hidden items-center space-x-4 pr-4">
        <button onClick={() => setIsSearchOpen(!isSearchOpen)}>
          <CiSearch style={style} size={30} />
        </button>

        <button
          onClick={() => setIsCartOpen(!isCartOpen)}
          className="relative flex items-center text-black focus:outline-none"
        >
          <CiShoppingCart size={32} />
          {cartItems > 0 && (
            <span
              className="absolute left-3 bottom-3 inline-flex items-center justify-center px-2 py-1 text-xs font-normal 
              leading-none text-white bg-customBlue rounded-full"
            >
              {cartItems}
            </span>
          )}
        </button>

        {isCartOpen && <Cart isCartOpen={isCartOpen} authSession={session} />}

        <GiHamburgerMenu
          style={style}
          size={24}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
      </div>

      {isMobileMenuOpen && (
        <div
          ref={menuRef}
          className="absolute top-14 inset-x-0 p-2 transition transform origin-top-right md:hidden"
        >
          <div className="rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
            <div className="px-5  flex items-center justify-between">
              <div className="-mr-2">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
                ></button>
              </div>
            </div>
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={handleMobileMenuItemClick}
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
                      isProductsDropdownOpen ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"
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
                      onClick={handleMobileMenuItemClick}
                    >
                      {d.name}
                    </Link>
                  ))}
                  <div className="pl-3 space-y-1 flex items-center">
                    <HoveredLink href="/category">
                      <div className="text-md pr-2 text-customBlue">
                        Load More
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
                onClick={handleMobileMenuItemClick}
              >
                About Us
              </Link>
              <Link
                href="/blog"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={handleMobileMenuItemClick}
              >
                Blog
              </Link>
              <Link
                href="/contact-us"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={handleMobileMenuItemClick}
              >
                Contact Us
              </Link>
              {session && session.user ? (
                <div className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                  <Link href="/profile-detail">{session.user.name}</Link>
                  <button
                    onClick={signMeOut}
                    className="mt-2 w-full bg-customBlue focus-visible:bg-customBlue text-white py-1 px-2 rounded"
                  >
                    Sign Out
                  </button>
                  <Link href="/order-history">
                <button className="mt-2 w-full bg-customBlue focus-visible:bg-customBaseBlue text-white py-1 px-2 rounded">
                  Order History
                </button>
              </Link>
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
      {isSearchOpen && (
        <div
          ref={searchRef}
          className="absolute lg:top-3 lg:w-[20%] lg:left-[69%] max-w-sm: top-16 inset-x-0 p-2 transition transform origin-top-right"
        >
          <div className="rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden p-2">
            <div className="flex items-center justify-between">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={searchHandler}
                className="w-full px-4 py-2 border rounded-md outline-none"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 "
              >
                <span className="sr-only">Close search</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="mt-2 max-h-60 overflow-y-auto">
              {searchResults.length > 0 ? (
                <ul className="list-none p-0 hover:cursor-pointer ">
                  {searchResults.map((item) => (
                    <Link
                      href={`/product/${item.prod_id}`}
                      key={item.prod_id}
                      className="flex items-center p-2 border-b hover:bg-customBlue/30"
                      onClick={handleMobileMenuItemClick}
                    >
                      <img
                        src={item.prod_images[0]}
                        alt={item.prod_name}
                        className="w-12 h-12 mr-2"
                      />
                      <span>{item.prod_name}</span>
                    </Link>
                  ))}
                </ul>
              ) : (
                <div className="p-2 text-gray-500">No items found</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
