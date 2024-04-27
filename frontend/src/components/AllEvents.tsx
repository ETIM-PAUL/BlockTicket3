import React, { useState } from "react";
import Logo from "./Logo";
import { Link } from "react-router-dom";
import WalletConnect from "./WalletConnect";
import { EventsData } from "../constants";

type Props = {};

const AllEvents = (props: Props) => {
    const [activeButton, setActiveButton] = useState("LiveEvent");

    const handleButtonClick = (button) => {
        setActiveButton(button);
    };

    return (
        <div className="">
            <div className=" navbar  bg-gradient-to-r from-[#5522CC] to-[#ED4690] py-8 px-6">
                <div className="flex-1 ml-16 ">
                    <Logo />
                </div>

                <div className="flex mr-14 gap-10">
                    <Link
                        to="/user-dashboard"
                        className="font-medium rounded-md text-xl px-4 py-3 text-center bg-white text-black"
                    >
                        Dashboard
                    </Link>

                    <WalletConnect />
                </div>
            </div>

            <div className="w-full bg-[#EEE1FF] h-10"></div>

            {/*  */}

            <div className="bg-base-100 p-8 bg-gradient-to-l from-[#5522CC] to-[#ED4690]">
                <div className="  flex flex-row gap-4 justify-end mr-20 mt-6 ">
                    <button
                        className={`py-2 rounded-md border border-bg-[#EEE1FF] w-48 items-center text-center flex  justify-center font-medium text-lg ${
                            activeButton === "LiveEvent"
                                ? "bg-white text-black"
                                : "bg-gradient-to-r from-[#5522CC] to-[#ED4690] rounded-md text-white w-[150px] hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]"
                        }`}
                        onClick={() => handleButtonClick("LiveEvent")}
                    >
                        Live Events
                    </button>

                    <button
                        className={`py-2 rounded-md border border-bg-[#EEE1FF] items-center text-center flex w-48  justify-center font-medium text-lg ${
                            activeButton === "UpcomingEvent"
                                ? "bg-white text-black"
                                : "bg-gradient-to-r from-[#5522CC] to-[#ED4690] rounded-md text-white w-[150px] hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]"
                        }`}
                        onClick={() => handleButtonClick("UpcomingEvent")}
                    >
                        Upcoming Events
                    </button>

                    <Link
                        to="/create-event"
                        className={`py-2 rounded-md border border-bg-[#EEE1FF] w-48   items-center text-center flex  justify-center font-medium text-lg ${
                            activeButton === "CreateEvent"
                                ? "bg-white"
                                : "bg-gradient-to-r from-[#5522CC] to-[#ED4690] rounded-md text-white w-[150px] hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]"
                        }`}
                        onClick={() => handleButtonClick("CreateEvent")}
                    >
                        Create Event
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-0  mt-4  mx-14 pb-20">
                    {EventsData.map((eventData) => (
                        <div
                            key={eventData.id}
                            className=" items-center mx-auto border-2 rounded-xl rounded-b-none shadow-md mt-10 "
                        >
                            <div className="flex flex-col">
                                <div className="">
                                    <img
                                        src={eventData.eventLogo}
                                        alt="Company-Logo"
                                        className="rounded-lg "
                                        width={300}
                                    />
                                </div>

                                <div className=" bg-[#EEE1FF] text-black">
                                    <div className="flex flex-col text-black py-2 px-3 ml-2">
                                        <h2 className="font-medium space-x- text-lg">
                                            <span> Event Title:</span>{" "}
                                            <span>{eventData.title}</span>
                                        </h2>
                                        <h2 className="space-x-2 font-medium ">
                                            <span className="font-medium">
                                                Minium Ticket Fee:
                                            </span>
                                            <span>{eventData.price}</span>
                                        </h2>

                                        <h2 className="space-x-2 font-medium ">
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
                                    className=" flex items-center justify-center    bg-gradient-to-r from-[#5522CC] to-[#ED4690] shadow-md border-t py-3 font-bold  text-white text-lg  hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]  -mb-1.5 "
                                >
                                    View More
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full bg-[#EEE1FF] h-10"></div>
        </div>
    );
};

export default AllEvents;
