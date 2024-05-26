import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatDate, formatIPFS } from "../constants";
import { CiLocationOn } from "react-icons/ci";
import { CiCalendarDate } from "react-icons/ci";
import { GiTakeMyMoney } from "react-icons/gi";
import { toast } from "react-toastify";
import { useConnectWallet, useSetChain } from "@web3-onboard/react";
import configFile from "../config.json";
import { GlobalContext } from "../context/GlobalContext";

type Props = {};

const config: any = configFile;


const AllEvents = (props: Props) => {
    const [activeButton, setActiveButton] = useState("LiveEvent");
    const { state } = useContext(GlobalContext);
    const [{ connectedChain }] = useSetChain();

    const navigate = useNavigate();
    const [{ wallet }] = useConnectWallet();

    const handleButtonClick = (button: string) => {
        setActiveButton(button);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])



    const createEvent = () => {
        if (!wallet?.accounts) {
            toast.error("Please Connect Your Wallet");
            return;
        } else {
            navigate("/create-event");
        }
    };
    return (
        <div className="h-full flex flex-col">
            <div className="w-full bg-[#EEE1FF] h-2"></div>
            <div className="bg-base-100 py-8 px-3 md:px-24 bg-gradient-to-l from-[#5522CC] to-[#ED4690]">
                {connectedChain && config[connectedChain.id]?.inspectAPIURL &&
                    <div className="flex items-center flex-row gap-2 md:gap-4 justify-start md:justify-end md:mt-6 ">
                        <button
                            className={`py-2 px-4 rounded-md border border-bg-[#EEE1FF] w-fit items-center text-center flex  justify-center font-medium text-lg ${activeButton === "LiveEvent"
                                ? "bg-white text-black"
                                : "bg-gradient-to-r from-[#5522CC] to-[#ED4690] rounded-md text-white w-fit hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]"
                                }`}
                            onClick={() => handleButtonClick("LiveEvent")}
                        >
                            Live
                        </button>

                        <button
                            className={`py-2 px-4 rounded-md border border-bg-[#EEE1FF] items-center text-center flex w-fit justify-center font-medium text-lg ${activeButton === "UpcomingEvent"
                                ? "bg-white text-black"
                                : "bg-gradient-to-r from-[#5522CC] to-[#ED4690] rounded-md text-white w-fit hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]"
                                }`}
                            onClick={() => handleButtonClick("UpcomingEvent")}
                        >
                            Upcoming
                        </button>

                        <button
                            className={`py-2 px-4 w-[200px] rounded-md border border-bg-[#EEE1FF] items-center text-center flex justify-center font-medium text-lg ${activeButton === "CreateEvent"
                                ? "bg-white"
                                : "bg-gradient-to-r from-[#5522CC] to-[#ED4690] rounded-md text-white w-fit hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]"
                                }`}
                            onClick={() => createEvent()}
                        >
                            Create
                        </button>
                    </div>
                }
                <div className="flex flex-wrap justify-start gap-4 mt-4 mx-1 pb-20">
                    {state.events.length === 0 && !state?.loading && (
                        <div className="text-white font-medium text-lg md:text-3xl mt-4 md:mt-10 ">
                            <h3>No Events</h3>
                        </div>
                    )}
                    {activeButton === "LiveEvent" && state.events.length > 0 && state.events.filter((event: any) => event.status === 1).length === 0 &&
                        <div className="text-white font-medium text-lg md:text-3xl mt-4 md:mt-10 ">
                            <h3>No Live Events</h3>
                        </div>
                    }
                    {activeButton === "UpcomingEvent" && state.events.length > 0 && state.events.filter((event: any) => event.status === 0).length === 0 &&
                        <div className="text-white font-medium text-lg md:text-3xl mt-4 md:mt-10 ">
                            <h3>No Upcoming Events</h3>
                        </div>
                    }
                    {state.events.length === 0 && state?.loading && (
                        <div className="text-white font-medium text-lg md:text-3xl mt-4 md:mt-10 ">
                            <h3>Fetching Events</h3>
                        </div>
                    )}

                    {state.events.length > 0 && activeButton === "LiveEvent" && state.events.filter((event: any) => event.status === 1).map((eventData: any) => (
                        <div
                            key={eventData?.id}
                            className="flex flex-col w-full md:max-w-[300px] items-center rounded-xl rounded-b-none shadow-md mt-4 md:mt-10 "
                        >
                            <div className="fle w-full">
                                <div className="">
                                    <img
                                        src={`https://ipfs.io/ipfs/${formatIPFS(
                                            eventData?.logoUrl
                                        )}`}
                                        alt="Event-Logo"
                                        className="rounded-t-lg w-full h-[200px] object-cover"
                                    />
                                </div>

                                <div className=" bg-[#EEE1FF] text-black">
                                    <div className="flex flex-col text-white py-2 px-3 gap-2">
                                        <h2 className="font-bold text-black">
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
                                                {eventData.tickets &&
                                                    JSON.parse(
                                                        eventData.tickets
                                                    )[0].price}
                                                ETH
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
                    {state.events.length > 0 && activeButton === "UpcomingEvent" && state.events.filter((event: any) => event.status === 0).map((eventData: any) => (
                        <div
                            key={eventData?.id}
                            className="flex flex-col w-full md:max-w-[300px] items-center rounded-xl rounded-b-none shadow-md mt-4 md:mt-10 "
                        >
                            <div className="fle w-full">
                                <div className="">
                                    <img
                                        src={`https://ipfs.io/ipfs/${formatIPFS(
                                            eventData?.logoUrl
                                        )}`}
                                        alt="Event-Logo"
                                        className="rounded-t-lg w-full h-[200px] object-cover"
                                    />
                                </div>

                                <div className=" bg-[#EEE1FF] text-black">
                                    <div className="flex flex-col text-white py-2 px-3 gap-2">
                                        <h2 className="font-bold text-black">
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
                                                {eventData.tickets &&
                                                    JSON.parse(
                                                        eventData.tickets
                                                    )[0].price}
                                                ETH
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
        </div>
    );
};

export default AllEvents;
