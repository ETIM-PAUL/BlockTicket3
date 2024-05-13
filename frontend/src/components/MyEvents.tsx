import React, { useState } from "react";
import { CiCalendarDate, CiLocationOn } from "react-icons/ci";
import { GiTakeMyMoney } from "react-icons/gi";
import { Link } from "react-router-dom";
import { formatDate, formatIPFS } from "../constants";

type Props = {
    events: any;
};
interface Report {
    payload: string;
}

const MyEvents = ({ events }: Props) => {
    const [loading, setLoading] = useState(false);

    return (
        <div>
            <div className="flex flex-wrap justify-start gap-4 mt-4 mx-1 pb-20">
                {events && events?.length === 0 && !loading &&
                    <div
                        className="text-white font-medium text-lg md:text-3xl mt-10 "
                    >
                        <h3>No Events</h3>
                    </div>
                }

                {events && events?.length === 0 && loading &&
                    <div
                        className="text-white font-medium text-lg md:text-3xl mt-10 "
                    >
                        <h3>Fetching User Events</h3>
                    </div>
                }

                {events && events?.length > 0 && events.map((eventData: any) => (
                    <div
                        key={eventData?.id}
                        className="flex grow flex-col max-w-[300px] items-center rounded-xl rounded-b-none shadow-md mt-10 "
                    >
                        <div className="fle">
                            <div className="">
                                <img
                                    src={`https://ipfs.io/ipfs/${formatIPFS(eventData?.logoUrl)}`}
                                    alt="Event-Logo"
                                    className=" w-full rounded-t-lg"
                                    width={300}
                                />
                            </div>

                            {/* <div className=" bg-[#EEE1FF] text-black"> */}

                            <div className=" bg-[#EEE1FF] text-black ">
                                <div className="flex flex-col text-white py-2 px-3 space-y-2">
                                    <h2 className="font-bold space-x-2 text-black">
                                        <span>{eventData.title}</span>
                                    </h2>
                                    <p className="font-normal flex flex-row gap-1 text-[#6A6A6A]">
                                        <CiCalendarDate className="w-7 h-7" />
                                        {formatDate(eventData.date)}
                                    </p>

                                    <p className="text-lg flex flex-row gap-1 text-[#6A6A6A]">
                                        <CiLocationOn className="w-7 h-7" />
                                        <span>
                                            {eventData.location}
                                        </span>
                                    </p>

                                    <p className=" flex flex-row gap-1 text-lg  text-[#6A6A6A] pb-4">
                                        <GiTakeMyMoney className="w-7 h-7" />
                                        <span>
                                            {eventData.tickets && JSON.parse(eventData.tickets)[0].price}ETH
                                        </span>{" "}
                                    </p>
                                </div>
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
