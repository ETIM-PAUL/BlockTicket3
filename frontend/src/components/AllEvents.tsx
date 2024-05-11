import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EventsData, formatDate, formatIPFS } from "../constants";
import { CiLocationOn } from "react-icons/ci";
import { CiCalendarDate } from "react-icons/ci";
import { GiTakeMyMoney } from "react-icons/gi";
import TopNav from "./TopNav";
import { toast } from "react-toastify";
import { useConnectWallet, useSetChain } from "@web3-onboard/react";
import configFile from "../config.json";
import { ethers } from "ethers";

type Props = {};

const config: any = configFile;
interface Report {
    payload: string;
}

const AllEvents = (props: Props) => {
    const [activeButton, setActiveButton] = useState("LiveEvent");
    const [loading, setLoading] = useState(false);
    const [allEvents, setAllEvents] = useState<any>([]);
    const [{ connectedChain }] = useSetChain();
    const [reports, setReports] = useState<string[]>([]);
    const [decodedReports, setDecodedReports] = useState<any>({});
    const [metadata, setMetadata] = useState<any>({});
    const [hexData, setHexData] = useState<boolean>(false);
    const [postData, setPostData] = useState<boolean>(false);

    const navigate = useNavigate();
    const [{ wallet }] = useConnectWallet();

    const handleButtonClick = (button) => {
        setActiveButton(button);
    };

    const fetchEvents = async (str: string) => {
        setLoading(true);
        let payload = str;
        if (!connectedChain) {
            return;
        }

        let apiURL = ""

        if (config[connectedChain.id]?.inspectAPIURL) {
            apiURL = `${config[connectedChain.id].inspectAPIURL}/inspect`;
        } else {
            console.error(`No inspect interface defined for chain ${connectedChain.id}`);
            return;
        }

        let fetchData: Promise<Response>;
        if (postData) {
            const payloadBlob = new TextEncoder().encode(payload);
            fetchData = fetch(`${apiURL}`, { method: 'POST', body: payloadBlob });
        } else {
            fetchData = fetch(`${apiURL}/${payload}`);
        }
        fetchData
            .then(response => response.json())
            .then(data => {
                setReports(data.reports);
                setMetadata({ status: data.status, exception_payload: data.exception_payload });

                // Decode payload from each report
                const decode = data.reports.map((report: Report) => {
                    return ethers.utils.toUtf8String(report.payload);
                });
                const reportData = JSON.parse(decode)
                console.log("parsed Reports:", reportData);
                setAllEvents(reportData)
                setLoading(false);
                //console.log(parseEther("1000000000000000000", "gwei"))
            });
    }

    useEffect(() => {
        fetchEvents("get_all/")
    }, [])

    const createEvent = () => {
        if (!wallet?.accounts) {
            toast.error("Please Connect Your Wallet")
            return;
        } else {
            navigate("/create-event")
        }
    }
    return (
        <div className="h-full">
            <TopNav />

            <div className="w-full bg-[#EEE1FF] h-2"></div>
            <div className="bg-base-100 p-8 bg-gradient-to-l from-[#5522CC] to-[#ED4690]">
                <div className="flex items-center mx-14 flex-row gap-4 justify-end mt-6 ">
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

                    <button
                        className={`py-2 px-4 h-[45px] rounded-md border border-bg-[#EEE1FF] items-center text-center flex w-fit justify-center font-medium text-lg ${activeButton === "CreateEvent"
                            ? "bg-white"
                            : "bg-gradient-to-r from-[#5522CC] to-[#ED4690] rounded-md text-white w-fit hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]"
                            }`}
                        onClick={() => createEvent()}
                    >
                        Create Event
                    </button>
                </div>

                <div className="flex flex-wrap justify-start gap-4 mt-4 mx-1 pb-20">
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

                    {allEvents.length > 0 && allEvents.map((eventData) => (
                        <div
                            key={eventData?.id}
                            className="flex flex-col w-full md:max-w-[350px] items-center rounded-xl rounded-b-none shadow-md mt-10 "
                        >
                            <div className="fle w-full">
                                <div className="">
                                    <img
                                        src={`https://ipfs.io/ipfs/${formatIPFS(eventData?.logoUrl)}`}
                                        alt="Company-Logo"
                                        className="rounded-t-lg w-full h-[200px] object-cover"
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
