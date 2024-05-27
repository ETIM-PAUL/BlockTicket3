import React, { useEffect, useState } from "react";
import { bgImage, heroImage } from "../assets";
import Logo from "./Logo";
import { Link, useNavigate } from "react-router-dom";
import configFile from "../config.json";
import WalletConnect from "./WalletConnect";
import { useConnectWallet, useSetChain } from "@web3-onboard/react";
import { toast } from "react-toastify";

type Props = {};
const config: any = configFile;

const TopNav = (props: Props) => {
    const [{ wallet }] = useConnectWallet();
    const [{ connectedChain }] = useSetChain();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const navigate = useNavigate();
    const toggleMobileNav = () => {
        setMobileNavOpen(!mobileNavOpen);
    };

    useEffect(() => {
        if (!connectedChain) {
            return;
        }
        if (!config[connectedChain.id]?.inspectAPIURL) {
            console.error(
                `No inspect interface defined for chain ${connectedChain.id}`
            );
            toast.error("Wrong Network, Please Switch Network");
            navigate("/events")
            return;
        }
    }, [])


    return (
        <>
            {/* Background Image and Hero */}
            <nav className="bg-white border-gray-200 px-3 py-3 md:py-2 md:px-24  bg-gradient-to-r from-[#5522CC] to-[#ED4690]">
                <div className="flex items-center  justify-between">
                    <div className="w-full flex flex-wrap  justify-between md:mx-auto md:p-4 mx-">
                        <div className="md:-ml-8 mt- md:mt-0 ">
                            <Logo />
                        </div>
                        <div className=" hidden lg:flex  -mr-8  md:order-2 md:space-x-0 rtl:space-x-reverse gap-6">
                            {wallet && (
                                <button>
                                    <Link
                                        to="/events"
                                        className="font-medium  rounded-lg text-base md:text-lg p-2 md:px-4 md:py-3 text-center bg-white text-black"
                                    >
                                        Events
                                    </Link>
                                </button>
                            )}
                            {wallet && (
                                <button>
                                    <Link
                                        to="/user-dashboard"
                                        className="font-medium  rounded-lg text-base md:text-lg p-2 md:px-4 md:py-3 text-center bg-white text-black"
                                    >
                                        Dashboard
                                    </Link>
                                </button>
                            )}
                            {wallet && (
                                <button>
                                    <Link
                                        to="/my-wallet"
                                        className="font-medium rounded-lg text-base md:text-lg p-2 md:px-4 md:py-3 text-center bg-white text-black"
                                    >
                                        My Wallet
                                    </Link>
                                </button>
                            )}

                            <WalletConnect />
                        </div>
                    </div>

                    {/* Mobile Nav */}

                    <button
                        className="w-16 block lg:hidden"
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
                        <div className="flex lg:hidden flex-col items-end absolute right-0 top-14 menu menu-sm dropdown-content mt-3 z-40 py-2 px-8 shadow-xl bg-base-100 w-full rounded-sm space-y-3 ">
                            <li>
                                {wallet && (
                                    <Link
                                        to="/events"
                                        className="font-medium rounded-md  text-base md:text-xl px-4 py-3 text-center bg-white text-black"
                                    >
                                        Events
                                    </Link>
                                )}
                            </li>
                            <li>
                                {wallet && (
                                    <Link
                                        to="/user-dashboard"
                                        className="font-medium rounded-md  text-base md:text-xl px-4 py-3 text-center bg-white text-black"
                                    >
                                        Dashboard
                                    </Link>
                                )}
                            </li>
                            <li>
                                {wallet && (
                                    <Link
                                        to="/my-wallet"
                                        className="font-medium rounded-md  text-base md:text-xl md:px-4 py-3 text-center bg-white text-black"
                                    >
                                        My Wallet
                                    </Link>
                                )}
                            </li>
                            <li>
                                <WalletConnect />
                            </li>
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
};
export default TopNav;
