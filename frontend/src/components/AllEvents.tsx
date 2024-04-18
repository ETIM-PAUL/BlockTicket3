import React from "react";
import Logo from "./Logo";
import { Link } from "react-router-dom";
import WalletConnect from "./WalletConnect";
import { EventsData } from "../constants";

type Props = {};

const AllEvents = (props: Props) => {
    return (
        <div className="">
            <div className=" navbar dark:bg-gray-900  p-6  ">
                <div className="flex-1 ml-16 ">
                    <Logo />
                </div>
                <div className="flex mr-16 ">
                    <WalletConnect />
                </div>
            </div>

            {/*  */}

            <div className="  flex flex-row gap-4 justify-end mr-20 mt-6 ">
                <Link
                    to="/upcoming-events"
                    className="bg-black text-white btn hover:bg-white hover:text-black"
                >
                    Upcoming Events
                </Link>
                <Link
                    to="/live-events"
                    className="bg-black text-white btn hover:bg-white hover:text-black "
                >
                    Live Events
                </Link>

                <Link
                    to="/create-event"
                    className="bg-black text-white btn hover:bg-white hover:text-black "
                >
                    Create Event
                </Link>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-4 gap-0  mt-4  mx-14  pb-20">
                {EventsData.map((eventData) => (
                    <div
                        key={eventData.id}
                        className=" items-center mx-auto border-2 rounded-xl shadow-md mt-10 "
                    >
                        <div className="flex flex-col">
                            <div className="">
                                <img
                                    src={eventData.eventLogo}
                                    alt="Company-Logo"
                                    className="rounded-lg -mt-2"
                                    width={300}
                                />
                            </div>

                            <div className="bg-black rounded-lg mt-0.5">
                                <div className="flex flex-col text-white py-2 px-3">
                                    <h2 className="font-medium space-x-2">
                                        <span> Event Title:</span>{" "}
                                        <span>{eventData.title}</span>
                                    </h2>
                                    <h2 className="space-x-2 font-medium">
                                        <span className="font-medium">
                                            Minium Ticket Fee:
                                        </span>
                                        <span>{eventData.price}</span>
                                    </h2>

                                    <h2 className="space-x-2 font-medium">
                                        <span className="font-semibold">
                                            Country:
                                        </span>
                                        <span>{eventData.country}</span>
                                    </h2>

                                    <h2 className="space-x-2 font-medium">
                                        <span className="font-semibold">
                                            Date:
                                        </span>
                                        <span>{eventData.date}</span>
                                    </h2>
                                </div>
                            </div>
                            <Link
                                to={`/event-details/${eventData.id}`}
                                className="mt-2 flex items-center justify-center border-gray-200 border bg-white shadow-md border-t rounded-md py-3 font-bold  text-black text-lg hover:bg-black hover:text-white -mb-1"
                            >
                                View More
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllEvents;
