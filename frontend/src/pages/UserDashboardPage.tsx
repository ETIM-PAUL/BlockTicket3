import React from "react";
import UserDashboard from "../components/UserDashboard";
import Footer from "../components/Footer";
import TopNav from "../components/TopNav";
import { useWallets } from "@web3-onboard/react";

type Props = {};

const UserDashboardPage = (props: Props) => {
    const [connectedWallet] = useWallets();

    return (
        <div className="bg-white flex flex-col h-full w-full">
            <TopNav />
            <div className="md:h-[78vh]">
                {connectedWallet ?
                    <UserDashboard />
                    :
                    <div className="h-full flex flex-col">
                        <div className="w-full bg-[#EEE1FF] h-2"></div>
                        <div className="bg-base-100 h-full py-8 px-6 md:px-24 bg-gradient-to-l from-[#5522CC] to-[#ED4690]">
                            <div
                                className="text-white font-medium text-lg md:text-3xl md:mt-10 "
                            >
                                <h3>Please Connect Your Wallet to Fetch Your Data</h3>
                            </div>
                        </div>
                        <div className="w-full bg-[#EEE1FF] h-2"></div>
                    </div>
                }
            </div>
            <Footer />
        </div>
    );
};

export default UserDashboardPage;
