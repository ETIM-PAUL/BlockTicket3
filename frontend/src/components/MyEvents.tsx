import React, { useEffect, useState } from "react";
import { UpcomingEventsData } from "../constants";
import { CiCalendarDate, CiLocationOn } from "react-icons/ci";
import { GiTakeMyMoney } from "react-icons/gi";
import { Link } from "react-router-dom";

type Props = {};

const MyEvents = (props: Props) => {
    const [loading, setLoading] = useState(false);
    const [allEvents, setAllEvents] = useState([]);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setAllEvents(UpcomingEventsData);
        }, 1000);
    }, []);

    return (
        <div>
            <div className="flex flex-wrap justify-start gap-4 mt-4 mx-1 pb-20">
                {allEvents.length === 0 && !loading && (
                    <div className="text-white font-medium text-lg md:text-3xl mt-10 ">
                        <h3>No Events</h3>
                    </div>
                )}

                {allEvents.length === 0 && loading && (
                    <div className="text-white font-medium text-lg md:text-3xl mt-10 ">
                        <h3>Fetching User Events</h3>
                    </div>
                )}

                {allEvents.length > 0 &&
                    allEvents.map((eventData: any) => (
                        <div
                            key={eventData?.id}
                            className="flex grow flex-col w-3/4 md:w-[300px] items-center rounded-xl rounded-b-none shadow-md mt-10  "
                        >
                            <div className="">
                                <img
                                    src={eventData.flyer}
                                    alt="Event-Logo"
                                    className=" w-full rounded-t-lg"
                                />
                            </div>

                            <div className=" bg-[#EEE1FF] text-black ">
                                <div className="flex flex-col text-white py-2 px-3 space-y-2">
                                    <h2 className="font-bold space-x-2 text-black">
                                        <span>{eventData.title}</span>
                                    </h2>
                                    <p className="font-normal flex flex-row gap-1 text-[#6A6A6A]">
                                        <CiCalendarDate className="w-7 h-7" />
                                        {eventData.date}
                                    </p>

                                    <p className="text-lg flex flex-row gap-1 text-[#6A6A6A]">
                                        <CiLocationOn className="w-7 h-7" />
                                        <span>{eventData.location}</span>
                                    </p>

                                    <p className=" flex flex-row gap-1 text-lg  text-[#6A6A6A] pb-4">
                                        <GiTakeMyMoney className="w-7 h-7" />
                                        <span>{eventData.price}</span>{" "}
                                    </p>
                                </div>
                            </div>

                            <Link
                                to={`/event-details/${eventData?.id}`}
                                className="text-center bg-gradient-to-r from-[#5522CC] to-[#ED4690] w-full shadow-md border-t py-3 font-bold  text-white text-lg  hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]"
                            >
                                View More
                            </Link>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default MyEvents;
