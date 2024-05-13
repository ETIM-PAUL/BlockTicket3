import React, { Suspense, lazy, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { NavLink, useNavigate } from "react-router-dom";
import { EventsData, formatIPFS } from "../constants";
import { Link, useParams } from "react-router-dom";
import WalletConnect from "./WalletConnect";
import Logo from "./Logo";
import ProposalTable from "./ProposalTable";
import { PurchaseHistory } from "../constants";
import { minimumPrice, shortenAddress } from "../utils";
import BuyTicketModal from "./modals/BuyTicketModal";
import TicketPurchaseModal from "./modals/TicketPurchaseModal";
import StartEventModal from "./modals/StartEventModal";
import EndEventModal from "./modals/EndEventModal";
import NewProposalModal from "./modals/NewProposalModal";
import ParticipantModal from "./modals/ParticipantModal";
import ParticipantTable from "./ParticipantTable";
import TopNav from "./TopNav";
import { useConnectWallet, useSetChain } from "@web3-onboard/react";
import { toast } from "react-toastify";
import configFile from "../config.json";
import { ethers } from "ethers";
import Footer from "./Footer";

const config: any = configFile;
interface Report {
    payload: string;
}

const EventDetails = () => {
    // Get the id from the URL
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [{ connectedChain }] = useSetChain();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [eventDetails, setEventDetails] = useState<any>();
    const [eventParticipants, setEventParticipants] = useState<any>([]);
    const [eventReferrals, setEventReferrals] = useState<any>([]);
    const [showStartEventModal, setShowStartEventModal] =
        useState<boolean>(false);
    const [showEndEventModal, setShowEndEventModal] = useState<boolean>(false);
    const [showNewProposalModal, setShowNewProposalModal] =
        useState<boolean>(false);
    const [showParticipantTable, setShowParticipantTable] = useState(false);
    const [postData, setPostData] = useState<boolean>(false);

    const [{ wallet }] = useConnectWallet();

    // Function to toggle between showing the proposal table and the participant table

    const showProposalTable = () => {
        setShowParticipantTable(false);
    };

    const showParticipant = () => {
        setShowParticipantTable(true);
    };

    const startEvent = () => {
        if (eventDetails?.status === 1) {
            toast.error("Event is in Progress")
            return;
        }
        if (wallet?.accounts[0]?.address !== eventDetails?.organizer) {
            toast.error("Unauthorized access. Not Event Organizer")
            return;
        } else {
            setShowStartEventModal(
                true
            )
        }
    };
    const endEvent = () => {
        if (eventDetails?.status !== 1) {
            toast.error("Event is not in Progress")
            return;
        }
        if (wallet?.accounts[0]?.address !== eventDetails?.organizer) {
            toast.error("Unauthorized access. Not Event Organizer")
            return;
        } else {
            setShowEndEventModal(
                true
            )
        }
    };
    const buyTicket = () => {
        if (eventDetails?.status !== 0) {
            toast.error("Event has either Started, Ended, or Cancelled ")
            return;
        } else {
            setShowModal(
                true
            )
        }
    };

    // Find the event with the matching id
    const fetchEventDetails = async (str: string) => {
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
                // Decode payload from each report
                const decode = data.reports.map((report: Report) => {
                    return ethers.utils.toUtf8String(report.payload);
                });
                const reportData = JSON.parse(decode)
                setEventDetails(reportData.event)
                setEventParticipants(reportData.event_tickets ?? [])
                setLoading(false);
            });
    }

    const fetchReferralCodes = async (str: string) => {
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
        fetchData = fetch(`${apiURL}/${payload}`);

        fetchData
            .then(response => response.json())
            .then(data => {
                // Decode payload from each report
                const decode = data.reports.map((report: Report) => {
                    return ethers.utils.toUtf8String(report.payload);
                });
                const reportData = JSON.parse(decode)
                setEventReferrals(reportData);
            });
    }

    const showProposalModal = () => {
        const participants = JSON.parse(eventDetails.tickets)
        console.log(participants)
        if (wallet?.accounts[0]?.address === eventDetails?.organizer) {
            toast.error("Unauthorized access. You'are Event Organizer");
            return;
        }
        if (!participants?.find((participant: any) => participant.address === wallet?.accounts[0]?.address)) {
            toast.error("Not Event Participant");
            return;
        } else {
            setShowNewProposalModal(
                true
            )
        }
    }

    useEffect(() => {
        fetchEventDetails(`get/${Number(id)}`)
        fetchReferralCodes(`get_event_referrals/${Number(id)}`)
        // If no eventData was found, show a message
    }, [])

    return (
        <>
            {eventDetails?.id &&
                <main className="min-h-screen bg-white">
                    <div className="bg-white px-3 py-4 md:px-20 md:py-10 flex flex-col items-stretch">
                        <div className="flex w-full flex-col items-stretch ">
                            <div className="bg-gradient-to-r from-[#6d46c9] to-purple-600  p-6 flex w-full flex-col rounded-md max-md:max-w-full">
                                <div className="w-full max-md:max-w-full">
                                    <div className="flex gap-5 max-md:flex-col max-md:gap-0 w-full">
                                        <div className="flex flex-col w-full max-md:ml-0 max-md:w-full">
                                            <div className="flex flex-col grow justify-center py-4 md:py-10 md:px-5  text-white bg-gradient-to-l from-blue-500 to-purple-600">
                                                <div className="flex justify-center items-center">
                                                    <img
                                                        alt="event_logo"
                                                        src={`https://ipfs.io/ipfs/${formatIPFS(eventDetails?.logoUrl)}`}
                                                        className="w-1/2"
                                                    />
                                                </div>

                                                {wallet?.accounts[0]?.address === eventDetails?.organizer &&
                                                    <div className="flex gap-3 md:gap-5 justify-center mx-6 mt-10 text-base font-bold text-center max-md:flex-wrap max-md:mr-2.5 max-md:max-w-full">
                                                        <button
                                                            className=" w-1/2 bg-gradient-to-r from-[#5522CC] to-[#ED4690] hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF] px-6 py-3 "
                                                            onClick={() => startEvent()}
                                                        >
                                                            Start Event
                                                        </button>

                                                        <button
                                                            className="w-1/2 bg-gradient-to-r from-[#5522CC] to-[#ED4690] hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF] px-6 py-3 "
                                                            onClick={() => endEvent()}

                                                        >
                                                            End Event
                                                        </button>
                                                    </div>
                                                }

                                                <div className=" mx-6 flex flex-col justify-center p-3 mt-0 md:mt-6 bg-white text-black max-md:px-5">
                                                    <div className="flex flex-col gap-3 md:gap-5 justify-between max-md:max-w-full">
                                                        <p className="flex justify-center items-center mx-auto gap-4 text-xl">
                                                            {" "}
                                                            Minimum Ticket Price{" "}
                                                            <span>
                                                                {minimumPrice(JSON.parse(eventDetails.tickets))}ETH
                                                            </span>{" "}
                                                        </p>

                                                        <button
                                                            className="bg-gradient-to-r from-[#5522CC] to-[#ED4690] hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF] text-white text-xl font-bold flex items-center justify-center h-12 p-4 shadow-lg cursor-pointer"
                                                            onClick={() => buyTicket()}

                                                        >
                                                            Buy Ticket
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col w-full max-md:ml-0 max-md:w-full bg-gradient-to-l from-blue-500 to-purple-600  ">
                                            <div className="flex flex-col justify-center  w-full text-base  max-md:mt-8 max-md:max-w-full ">
                                                <div className="justify-center px-8 py-6  text-md md:text-xl font-bold text-white   max-md:px-5 max-md:max-w-full bg-gradient-to-r from-[#5522CC] to-[#ED4690] ">
                                                    Purchase History
                                                </div>
                                                {PurchaseHistory.length > 0 &&
                                                    <span className="text-white text-lg md:text-xl px-8 mt-3">No Ticket has been Purchased Yet.</span>
                                                }
                                                {PurchaseHistory.length === 0 && PurchaseHistory.slice(-5).map(
                                                    (purchase, index) => (
                                                        <div
                                                            key={index}
                                                            className={`flex flex-col justify-center px-8 py-6 border-b border-solid bg-gradient-to-l from-blue-500 to-purple-600  max-md:max-w-full ${index === 4
                                                                ? "border-b-0"
                                                                : ""
                                                                }`}
                                                        >
                                                            <div className="flex flex-row space-x-2 text-white text-lg">
                                                                <p>
                                                                    {shortenAddress(
                                                                        purchase.address
                                                                    )}
                                                                </p>
                                                                <p>Purchased</p>
                                                                <span>
                                                                    {
                                                                        purchase.ticketType
                                                                    }{" "}
                                                                    Ticket
                                                                </span>
                                                            </div>
                                                            <span>
                                                                {purchase.time}
                                                            </span>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex text-lg font-normal gap-2 mt-10">
                                    <button
                                        className={`flex justify-center mt-4 py-2 max-w-full ${!showParticipantTable
                                            ? "bg-gradient-to-r text-white from-[#5522CC] to-[#ED4690] hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]"
                                            : "bg-white text-black hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]"
                                            } w-[130px] text-lg font-medium`}
                                        onClick={showProposalTable}
                                    >
                                        Proposals
                                    </button>
                                    <button
                                        className={`flex justify-center mt-4 py-2 max-w-full ${showParticipantTable
                                            ? "bg-gradient-to-r text-white from-[#5522CC] to-[#ED4690] hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]"
                                            : "bg-white text-black hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]"
                                            } w-[130px] text-lg font-medium`}
                                        onClick={showParticipant}
                                    >
                                        Participants{" "}
                                    </button>
                                </div>
                                {!showParticipantTable && wallet?.accounts && eventDetails?.dao &&
                                    <div className="flex flex-row justify-between mt-6 mx-2 text-white ">
                                        <div className="w-full flex justify-end">
                                            <button
                                                className="w-fit bg-gradient-to-r from-[#5522CC] to-[#ED4690] hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF] px-6 py-2 text-lg mb-4 font-medium"
                                                onClick={() =>
                                                    showProposalModal()
                                                }
                                            >
                                                Add Proposal
                                            </button>
                                        </div>
                                    </div>
                                }

                                {/* Modals */}
                                {/*  */}
                                <BuyTicketModal
                                    id={Number(id)}
                                    isVisible={showModal}
                                    organizer={eventDetails.organizer}
                                    referral={eventDetails.referral}
                                    eventReferrals={eventReferrals}
                                    tickets={JSON.parse(eventDetails.tickets)}
                                    onClose={() => setShowModal(false)}
                                    fetchEventDetails={() =>
                                        fetchEventDetails(`get/${Number(id)}`)
                                    }
                                />

                                {/*  */}

                                <div className="">
                                    <StartEventModal
                                        isVisible={
                                            showStartEventModal
                                        }
                                        id={Number(id)}
                                        onClose={() =>
                                            setShowStartEventModal(
                                                false
                                            )
                                        }
                                        eventDetails={eventDetails}
                                        setEventDetails={setEventDetails}
                                        fetchEventDetails={() =>
                                            fetchEventDetails(`get/${Number(id)}`)
                                        }

                                    />

                                    <EndEventModal
                                        isVisible={
                                            showEndEventModal
                                        }
                                        id={Number(id)}
                                        onClose={() =>
                                            setShowEndEventModal(
                                                false
                                            )
                                        }
                                        eventDetails={eventDetails}
                                        setEventDetails={setEventDetails}
                                        fetchEventDetails={() =>
                                            fetchEventDetails(`get/${Number(id)}`)
                                        }
                                    />
                                </div>

                                <NewProposalModal
                                    tickets={JSON.parse(eventDetails.tickets)}
                                    isVisible={showNewProposalModal}
                                    onClose={() =>
                                        setShowNewProposalModal(false)
                                    }
                                />

                                {showParticipantTable ? (
                                    <ParticipantTable eventParticipants={eventParticipants} />
                                ) : (
                                    <ProposalTable />
                                )}
                            </div>
                        </div>
                    </div>

                    <Footer />
                </main>
            }
        </>
    );
};

export default EventDetails;
