import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EventsData } from "../constants";
import { CiLocationOn } from "react-icons/ci";
import { CiCalendarDate } from "react-icons/ci";
import { GiTakeMyMoney } from "react-icons/gi";
import TopNav from "./TopNav";

type Props = {};

const AllEvents = (props: Props) => {
    const [activeButton, setActiveButton] = useState("LiveEvent");
    const [loading, setLoading] = useState(false);
    const [allEvents, setAllEvents] = useState([]);

    const handleButtonClick = (button) => {
        setActiveButton(button);
    };

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setAllEvents(EventsData)
        }, 1000);
    }, [])


    return (
        <div className="h-full">
            <TopNav />

            <div className="w-full bg-[#EEE1FF] h-2"></div>
            <div className="bg-base-100 p-8 bg-gradient-to-l from-[#5522CC] to-[#ED4690]">
                <div className="  flex flex-row gap-4 justify-end mr-20 mt-6 ">
                    <button
                        className={`py-2 px-4 rounded-md border border-bg-[#EEE1FF] w-fit items-center text-center flex  justify-center font-medium text-lg ${activeButton === "LiveEvent"
                            ? "bg-white text-black"
                            : "bg-gradient-to-r from-[#5522CC] to-[#ED4690] rounded-md text-white w-fit hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]"
                            }`}
                        onClick={() => handleButtonClick("LiveEvent")}
                    >
                        Live Events
                    </button>

                    <button
                        className={`py-2 px-4 rounded-md border border-bg-[#EEE1FF] items-center text-center flex w-fit justify-center font-medium text-lg ${activeButton === "UpcomingEvent"
                            ? "bg-white text-black"
                            : "bg-gradient-to-r from-[#5522CC] to-[#ED4690] rounded-md text-white w-fit hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]"
                            }`}
                        onClick={() => handleButtonClick("UpcomingEvent")}
                    >
                        Upcoming Events
                    </button>

                    <Link
                        to="/create-event"
                        className={`py-2 px-4 rounded-md border border-bg-[#EEE1FF] items-center text-center flex w-fit justify-center font-medium text-lg ${activeButton === "CreateEvent"
                            ? "bg-white"
                            : "bg-gradient-to-r from-[#5522CC] to-[#ED4690] rounded-md text-white w-fit hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]"
                            }`}
                        onClick={() => handleButtonClick("CreateEvent")}
                    >
                        Create Event
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-0  mt-4  mx-14 pb-20">
                    {allEvents.length === 0 && !loading &&
                        <div
                            className="text-white font-medium text-lg md:text-3xl mt-10 "
                        >
                            <h3>No Events</h3>
                        </div>
                    }
                    {allEvents.length === 0 && loading &&
                        <div
                            className="text-white font-medium text-lg md:text-3xl mt-10 "
                        >
                            <h3>Fetching Events</h3>
                        </div>
                    }

                    {allEvents.length > 0 && EventsData.map((eventData) => (
                        <div
                            key={eventData.id}
                            className="flex flex-col items-center mx-auto border-2 rounded-xl rounded-b-none pb- shadow-md mt-10 "
                        >
                            <div className="fle">
                                <div className="">
                                    <img
                                        src={eventData.eventLogo}
                                        alt="Company-Logo"
                                        className="rounded-t-lg "
                                        width={300}
                                    />
                                </div>

                                <div className=" bg-[#EEE1FF] text-black">
                                    <div className="flex flex-col text-white py-2 px-3 gap-2">
                                        <h2 className="font-bold text-black">
                                            <span>
                                                {eventData.title}
                                            </span>
                                        </h2>
                                        <p className="font-normal flex flex-row gap-1 text-[#6A6A6A]">
                                            <CiCalendarDate className="w-7 h-7" />
                                            {eventData.date}
                                        </p>

                                        <p className="text-lg flex flex-row gap-1 text-[#6A6A6A]">
                                            <CiLocationOn className="w-7 h-7" />
                                            <span>
                                                {eventData.country}
                                            </span>
                                        </p>

                                        <p className=" flex flex-row gap-1 text-lg  text-[#6A6A6A] pb-4">
                                            <GiTakeMyMoney className="w-7 h-7" />
                                            <span>
                                                {eventData.price}
                                            </span>{" "}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <Link
                                to={`/event-details/${eventData.id}`}
                                className="text-center bg-gradient-to-r from-[#5522CC] to-[#ED4690] w-full shadow-md border-t py-3 font-bold  text-white text-lg  hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]"
                            >
                                View More
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full bg-[#EEE1FF] h-2"></div>
        </div>
    );
};

export default AllEvents;
