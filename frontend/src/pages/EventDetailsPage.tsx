import React from "react";
import EventDetails from "../components/EventDetails";
import Footer from "../components/Footer";
import { useWallets } from "@web3-onboard/react";
import TopNav from "../components/TopNav";

type Props = {};

const EventDetailsPage = (props: Props) => {
    const [connectedWallet] = useWallets();

    return (
        <div className="bg-white flex flex-col h-full w-full">
            <TopNav />
            <div className="h-[80vh]">
                {connectedWallet ?
                    <EventDetails />
                    :
                    <div className="h-full flex flex-col">
                        <div className="w-full bg-[#EEE1FF] h-2"></div>
                        <div className="bg-base-100 h-full py-8 px-10 md:px-24 bg-gradient-to-l from-[#5522CC] to-[#ED4690]">

                            <div
                                className="text-white font-medium text-lg md:text-3xl mt-10 "
                            >
                                <h3>Please Connect Your Wallet to Fetch The Event Details</h3>
                            </div>
                        </div>
                        <div className="w-full bg-[#EEE1FF] h-2"></div>
                        <Footer />
                    </div>
                }
            </div>
        </div>
    );
};

export default EventDetailsPage;
