import React from "react";
import Logo from "./Logo";
import { Link } from "react-router-dom";
import WalletConnect from "./WalletConnect";
import { EventsData } from "../constants";

type Props = {};

const AllEvents = (props: Props) => {
    return (
        <div className=" bg-white  ">
            <div className="navbar bg-base-100 p-4  dark:bg-gray-900 ">
                <div className="flex-1 ">
                    <Logo />
                </div>
                <div className="flex mr-10 gap-10 ">
                    <Link to="/create-ticket" className="btn btn-ghost">
                        Create Ticket
                    </Link>

                    <WalletConnect />
                </div>
            </div>

            {/*  */}

            <div className="text-xl text-black flex flex-row gap-10 justify-end mr-20 mt-6">
                <Link to="/upcoming-events" className="btn btn-ghost">
                    Upcoming Events
                </Link>
                <Link to="/live-events" className="btn btn-ghost">
                    Live Events
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
                {EventsData.map((eventData) => (
                    <div
                        key={eventData.id}
                        className=" px-4 py-3 border-2 rounded-xl shadow-md mt-10 mx-10 text-black"
                    >
                        <div className="flex flex-col ">
                            <div className="items-center justify-center mx-auto ">
                                <img
                                    src={eventData.eventLogo}
                                    alt="Company-Logo"
                                    width={250}
                                />
                            </div>

                            <div className="flex flex-col mt-6 space-y-1 ">
                                <h2 className="font-semibold text-lg space-x-10">
                                    <span> Event Title:</span>{" "}
                                    <span>{eventData.title}</span>
                                </h2>
                                <h2 className="space-x-6">
                                    <span className="font-semibold">
                                        Minium Ticket Fee:
                                    </span>
                                    <span>{eventData.price}</span>
                                </h2>

                                <h2 className="space-x-6">
                                    <span className="font-semibold">
                                        Country:
                                    </span>
                                    <span>{eventData.country}</span>
                                </h2>

                                <h2 className="space-x-6">
                                    <span className="font-semibold">Date:</span>
                                    <span>{eventData.date}</span>
                                </h2>
                            </div>
                        </div>

                        <Link
                            to={`/event-details/${eventData?.payload?.id}`}
                            className="mt-6 flex items-center justify-center bg-black border-t rounded-b-md p-3 font-bold  text-white text-lg"
                        >
                            View More
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllEvents;
