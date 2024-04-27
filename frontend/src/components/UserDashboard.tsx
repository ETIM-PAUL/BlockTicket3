import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import WalletConnect from "./WalletConnect";
import MyEvents from "./MyEvents";
import MyEventsTickets from "./MyEventsTickets";

type Props = {};

const UserDashboard = (props: Props) => {
    const [showEventTicketTable, setShowEventTicketTable] = useState(false);

    const showProposalTable = () => {
        setShowEventTicketTable(false);
    };

    const showParticipant = () => {
        setShowEventTicketTable(true);
    };

    return (
        <div>
            <div className="navbar bg-base-100 p-8 bg-gradient-to-r from-[#5522CC] to-[#ED4690]">
                <div className="flex-1 ml-12 ">
                    <Logo />
                </div>
                <div className="flex mr-14 gap-10  ">
                    <Link
                        to="/events"
                        className="font-medium rounded-lg text-lg px-4 py-3 text-center bg-white text-black"
                    >
                        All Events
                    </Link>

                    <WalletConnect />
                </div>
            </div>

            <div className="w-full bg-[#EEE1FF] h-10"></div>

            <div className=" bg-gradient-to-l from-[#5522CC] to-[#ED4690]">
                <div className="flex  justify-end  text-lg font-normal gap-6  mr-24 pt-4  ">
                    <button
                        className={`flex justify-center border border-bg-[#EEE1FF]  mt-4 py-2 w-40 text-black ${
                            !showEventTicketTable
                                ? "bg-white text-black"
                                : "bg-gradient-to-r from-[#5522CC] to-[#ED4690]  text-white hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]"
                        } w-[130px] text-lg font-medium`}
                        onClick={showProposalTable}
                    >
                        My Events
                    </button>

                    <button
                        className={`flex justify-center border border-bg-[#EEE1FF]  mt-4 py-2 w-40 text-black ${
                            showEventTicketTable
                                ? "bg-white "
                                : "bg-gradient-to-r from-[#5522CC] to-[#ED4690] text-white hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]"
                        } w-[130px] text-lg font-medium`}
                        onClick={showParticipant}
                    >
                        Events Tickets
                    </button>
                </div>

                <div className="mx-20">
                    {showEventTicketTable ? <MyEventsTickets /> : <MyEvents />}
                </div>
            </div>
            <div className="w-full bg-[#EEE1FF] h-10"></div>
        </div>
    );
};

export default UserDashboard;
