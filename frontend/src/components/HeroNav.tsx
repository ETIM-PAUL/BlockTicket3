import React, { useState } from "react";
import { bgImage, heroImage } from "../assets";
import Logo from "./Logo";
import { Link } from "react-router-dom";

type Props = {};

const HeroNav = (props: Props) => {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    const toggleMobileNav = () => {
        setMobileNavOpen(!mobileNavOpen);
    };

    return (
        <>
            {/* Background Image and Hero */}
            <nav className="bg-white border-gray-200 px-3 py-3 md:py-2 md:px-24 bg-gradient-to-r from-[#5522CC] to-[#ED4690]">
                <div className="flex items-center  justify-between">
                    <div className="w-full flex flex-wrap  justify-between md:mx-auto  md:p-4 mx-10">
                        <div className="md:-ml-8 mt- md:mt-0 ">
                            <Logo />
                        </div>
                        <div className=" hidden md:flex  -mr-8  md:order-2 md:space-x-0 rtl:space-x-reverse gap-6">
                            <Link
                                to="/"
                                className="btn btn-ghost text-white font-medium text-lg"
                            >
                                About Us
                            </Link>

                            <Link
                                to="/"
                                className="btn btn-ghost text-white font-medium text-lg "
                            >
                                Contact Us
                            </Link>
                            {/* <WalletConnect /> */}

                            <Link
                                to="/events"
                                className=" font-medium  rounded-md text-lg px-4 py-3 text-center bg-white text-black"
                                id="launchApp"
                            >
                                Launch App
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Nav */}

                    <button
                        className="w-16 block md:hidden"
                        onClick={toggleMobileNav}
                    >
                        <svg
                            className="w-7 h-7 "
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 17 14"
                        >
                            <path
                                stroke="white"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M1 1h15M1 7h15M1 13h15"
                            />
                        </svg>
                    </button>
                </div>

                {mobileNavOpen && (
                    <div className="w-full px-">
                        <div className="flex md:hidden flex-col items-end absolute top-14 menu menu-sm dropdown-content mt-3 z-40 py-2 px-8 shadow-xl bg-base-100 w-full rounded-sm space-y-5 ">
                            <li>
                                <Link
                                    to="/events"
                                    className=" font-medium  rounded-md text-lg  text-center bg-white text-black"
                                    id="launchApp"
                                >
                                    Launch App
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/"
                                    className=" text-black font-medium text-lg"
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/"
                                    className=" text-black font-medium text-lg "
                                >
                                    Contact Us
                                </Link>
                            </li>
                        </div>
                    </div>
                )}
            </nav>

            <div
                className=" w-full relative h-[70vh] bg-cover md:bg-center"
                style={{ backgroundImage: `url(${bgImage})` }}
            >
                <div className="absolute top-0  left-0 w-full h-full bg-gradient-to-r from-[#5522CC] to-[#ED4690] opacity-85"></div>
                <div className=" relative z-10 flex items-center justify-center   h-full ">
                    <div className="flex md:flex-row flex-col items-center">
                        <div className="flex items-center">
                            <img
                                src={heroImage}
                                alt="hero_banner"
                                className=" hidden md:flex md:h-auto mt-20 "
                            />
                        </div>

                        <div className="flex flex-col md:w-1/2 md:mr-24 mr-0  items-center">
                            <p className="font-roboto font-bold md:text-3xl text-3xl text-white sm:leading-[75px] leading-[55px]  text-center">
                                On-Chain Tickets Gateway
                            </p>
                            <p className="text-dimBlack text-justify md:leading-7 leading-2 text-lg md:text-lg text-white items-center justify-center mx-10 md:mx-auto  mt-4">
                                On-Chain Event Ticketing, Management and DAO
                                proposal, allowing user to make proposal by
                                Upvoting or downvoting the events that they have
                                registered based on the quality and their
                                satisfaction.
                            </p>

                            <div className="flex md:w-full w-full items-center  justify-center mx-auto md:mx-0 ">
                                <Link
                                    to="/events"
                                    className="bg-[#F5167E]  text-center  mt-6 px-12 py-3 rounded-md  text-white text-xl hover:bg-[#ED4690] w-fit"
                                >
                                    Explore Events
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HeroNav;
