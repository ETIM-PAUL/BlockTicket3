import React from "react";
import { PastEventsData } from "../constants";
import { CiLocationOn } from "react-icons/ci";
import { CiCalendarDate } from "react-icons/ci";
import { GiTakeMyMoney } from "react-icons/gi";

type Props = {};

const PastEvents = (props: Props) => {
    return (
        <div className=" bg-white">
            <div className="px-6 md:px-24">
                <h1 className="flex justify-center text-center pt-10 text-black font-medium text-3xl">
                    Past Events
                </h1>

                <div className="flex flex-wrap md:gap-4 gap-0  mt-4 pb-20">
                    {PastEventsData.map((pastEventData) => (
                        <div
                            key={pastEventData.id}
                            className="grow items-center mx-auto border-2 rounded-2xl shadow-md mt-10 w-[300px]"
                        >
                            <div className="flex flex-col">
                                <div className="">
                                    <img
                                        src={pastEventData.flyer}
                                        alt="Company-Logo"
                                        className=" w-full rounded--t-lg "
                                    />
                                </div>

                                <div className="mt-1">
                                    <div className="flex flex-col text-white py-2 px-3 space-y-2">
                                        <h2 className="font-bold space-x-2 text-black">
                                            <span>
                                                {pastEventData.title}
                                            </span>
                                        </h2>
                                        <p className="font-normal text-[#6A6A6A]">
                                            {pastEventData.description}
                                        </p>

                                        <p className="font-normal flex flex-row gap-1 text-[#6A6A6A]">
                                            <CiCalendarDate className="w-7 h-7" />
                                            {pastEventData.date}
                                        </p>

                                        <p className="text-lg flex flex-row gap-1 text-[#6A6A6A]">
                                            <CiLocationOn className="w-7 h-7" />
                                            <span>
                                                {pastEventData.location}
                                            </span>
                                        </p>

                                        <p className=" flex flex-row gap-1 text-lg  text-[#6A6A6A] pb-4">
                                            <GiTakeMyMoney className="w-7 h-7" />
                                            <span>
                                                {pastEventData.price}
                                            </span>{" "}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PastEvents;
