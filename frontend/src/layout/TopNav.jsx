import { useConnectWallet } from "@web3-onboard/react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import WalletConnect from "../components/WalletConnect";

function TopNav() {
  
    return (
        <nav className="bg-white border-gray-200 dark:bg-gray-900 py-2">
            <div className="max-w-screen-xl flex flex-wrap  justify-between mx-auto p-4">
              <div className="-ml-8">
              <Logo />
              </div>
                <div className=" -mr-8 flex md:order-2 md:space-x-0 rtl:space-x-reverse gap-6">
                    <Link to="/" className="btn btn-ghost text-white font-medium text-lg">
                        About Us
                    </Link>

                    <Link to="/" className="btn btn-ghost text-white font-medium text-lg ">
                        Contact Us
                    </Link>
                    <WalletConnect />
                 
                    <button
                        data-collapse-toggle="navbar-cta"
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-controls="navbar-cta"
                        aria-expanded="false"
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 17 14"
                        >
                            <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M1 1h15M1 7h15M1 13h15"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default TopNav;
