import React from "react";
import { UpcomingEventsData } from "../constants";

type Props = {};

const MyEvents = (props: Props) => {
    return (
        <div>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4   mt-4    pb-20">
                {UpcomingEventsData.map((upcomingEventData) => (
                    <div
                        key={upcomingEventData.id}
                        className=" items-center mx-auto  border-2 rounded-2xl rounded-b-none shadow-md mt-10 "
                    >
                        <div className="flex flex-col">
                            <div className="">
                                <img
                                    src={upcomingEventData.flyer}
                                    alt="Company-Logo"
                                    className=" w-full rounded-lg rounded-b-none"
                                />
                            </div>

                            {/* <div className=" bg-[#EEE1FF] text-black"> */}

                            <div className=" bg-[#EEE1FF] text-black ">
                                <div className="flex flex-col text-white py-2 px-3 space-y-2">
                                    <h2 className="font-bold space-x-2 text-black">
                                        <span>{upcomingEventData.title}</span>
                                    </h2>
                                    <p className="font-normal text-[#6A6A6A]">
                                        {upcomingEventData.description}
                                    </p>

                                    <p className="font-normal pb-4 text-[#6A6A6A]">
                                        {upcomingEventData.date}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyEvents;
