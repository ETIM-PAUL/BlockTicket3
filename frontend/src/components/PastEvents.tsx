import React, { useEffect, useState } from "react";
import { PastEventsData, formatIPFS } from "../constants";
import { CiLocationOn } from "react-icons/ci";
import { CiCalendarDate } from "react-icons/ci";
import { GiTakeMyMoney } from "react-icons/gi";
import { ethers } from "ethers";
import { GlobalContext } from "../context/GlobalContext";
import configFile from "../config.json";


const PastEvents = () => {
  const {state, dispatch}:any = React.useContext(GlobalContext);
  const [allEvents, setAllEvents] = useState<[{
    capacity:number,
    dao:number,
    date:string,
    id:number,
    location:string,
    flyer:string,
    description:string,
    price:string,
    logoUrl:string,
    minReferrals:number,
    organizer:string,
    referral:number,
    referralDiscount:number,
    status:number,
    tickets:string,
    title:string,
    tokenUrl:string,
    totalETHBal:number,
  }]>([{
    capacity: 0,
    dao: 0,
    date: "",
    id: 0,
    location: "",
    flyer: "",
    description: "",
    price: "",
    logoUrl: "",
    minReferrals: 0,
    organizer: "",
    referral: 0,
    referralDiscount: 0,
    status: 0,
    tickets: "",
    title: "",
    tokenUrl: "",
    totalETHBal: 0,
  }])

    const config: any = configFile;

    const fetchEvents = async () => {
        try {
            
            let apiURL = "";
            let payload = "get_all/";

            if (config["0xaa37dc"]?.inspectAPIURL) {
                try {
                    apiURL = `${config["0xaa37dc"].inspectAPIURL}/inspect`;
                } catch (error) {
                    dispatch({
                        type: "SET_LOADING",
                        payload: false,
                    });
                }
            } else {
                console.error(
                    `No inspect interface defined for chain ${"0xaa37dc"}`
                );
                dispatch({
                    type: "SET_LOADING",
                    payload: false,
                });
                return;
            }

            let fetchData: Promise<Response>;
            fetchData = fetch(`${apiURL}/${payload}`);
            fetchData
                .then((response) => response.json())
                .then((data) => {
                    // Decode payload from each report
                    const decode = data.reports.map((report: { payload: string }) => {
                        return ethers.utils.toUtf8String(report.payload);
                    });
                    const reportData = JSON.parse(decode);
                    state.events = reportData
                    setAllEvents(reportData)

                    dispatch({
                        type: "SET_EVENTS",
                        payload: reportData,
                    });
                    dispatch({
                        type: "SET_LOADING",
                        payload: false,
                    });
                });
        } catch (error) {
            dispatch({
                type: "SET_LOADING",
                payload: false,
            });
            console.log(error);
            state.events = []

        }
    };

    useEffect(() => {
      fetchEvents();
    }, [])
    return (
        <div className=" bg-white">
            <div className="px-6 md:px-24">
                <h1 className="flex justify-center text-center pt-10 text-black font-medium text-3xl">
                    All Events
                </h1>

                <div className="flex flex-wrap md:gap-4 gap-0  mt-4 pb-20">
                    {allEvents?.length > 0 && allEvents.filter((item)=>item?.id > 0).map((event) => (
                        <div
                            key={event?.id}
                            className="grow items-center mx-auto border-2 rounded-2xl shadow-md mt-10 w-[300px]"
                        >
                            <div className="flex flex-col">
                                <div className="h-[200px] object-cover">
                                    <img
                                        src={`https://ipfs.io/ipfs/${formatIPFS(
                                            event?.logoUrl
                                        )}`}
                                        alt="Company-Logo"
                                        className="h-full w-full rounded--t-lg object-cover"
                                    />
                                </div>

                                <div className="mt-1">
                                    <div className="flex flex-col text-white py-2 px-3 space-y-2">
                                        <h2 className="font-bold space-x-2 text-black">
                                            <span>
                                                {event.title}
                                            </span>
                                        </h2>
                                        <p className="font-normal text-[#6A6A6A]">
                                            {event.description}
                                        </p>

                                        <p className="font-normal flex flex-row gap-1 text-[#6A6A6A]">
                                            <CiCalendarDate className="w-7 h-7" />
                                            {event.date}
                                        </p>

                                        <p className="text-lg flex flex-row gap-1 text-[#6A6A6A]">
                                            <CiLocationOn className="w-7 h-7" />
                                            <span>
                                                {event.location}
                                            </span>
                                        </p>

                                        <p className=" flex flex-row gap-1 text-lg  text-[#6A6A6A] pb-4">
                                            <GiTakeMyMoney className="w-7 h-7" />
                                            <span>
                                                {event.tickets && JSON.parse(event.tickets)[0].price}ETH
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
