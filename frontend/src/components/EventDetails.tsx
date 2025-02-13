import React, { useContext, useEffect, useState } from "react";
import { formatIPFS } from "../constants";
import { useParams } from "react-router-dom";
import ProposalTable from "./ProposalTable";
import { minimumPrice } from "../utils";
import BuyTicketModal from "./modals/BuyTicketModal";
import StartEventModal from "./modals/StartEventModal";
import EndEventModal from "./modals/EndEventModal";
import NewProposalModal from "./modals/NewProposalModal";
import ParticipantTable from "./ParticipantTable";
import { useConnectWallet, useSetChain } from "@web3-onboard/react";
import { toast } from "react-toastify";
import configFile from "../config.json";
import { ethers } from "ethers";
import CancelEventModal from "./modals/CancelEventModal";
import moment from "moment";
import { GlobalContext } from "../context/GlobalContext";

const config: any = configFile;
interface Report {
    payload: string;
}

const EventDetails = () => {
    // Get the id from the URL
    const { state }: any = useContext(GlobalContext);
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [{ connectedChain }] = useSetChain();
    const [balance, setBalance] = useState<string>(state?.balance)
    const [showModal, setShowModal] = useState<boolean>(false);
    const [eventDetails, setEventDetails] = useState<any>();
    const [eventParticipants, setEventParticipants] = useState<any>([]);
    const [eventProposals, setEventProposals] = useState<any>([]);
    const [eventReferrals, setEventReferrals] = useState<any>([]);
    const [showStartEventModal, setShowStartEventModal] =
        useState<boolean>(false);
    const [showCancelEventModal, setShowCancelEventModal] =
        useState<boolean>(false);
    const [showEndEventModal, setShowEndEventModal] = useState<boolean>(false);
    const [showNewProposalModal, setShowNewProposalModal] =
        useState<boolean>(false);
    const [showParticipantTable, setShowParticipantTable] = useState(true);
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

    const cancelEvent = () => {
        if (eventDetails?.status !== 0) {
            toast.error("Event has either Started, Ended, or Cancelled ")
            return;
        }
        if (wallet?.accounts[0]?.address !== eventDetails?.organizer) {
            toast.error("Unauthorized access. Not Event Organizer")
            return;
        } else {
            setShowCancelEventModal(
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
                setEventReferrals(reportData.event_referrals ?? [])
                setEventProposals(reportData.event_proposals ?? [])
                setLoading(false);
            });
    }

    const showProposalModal = () => {
        if (eventParticipants?.length > 0 && eventParticipants.finwallet?.accounts[0]?.address === eventDetails?.organizer) {
            toast.error("Unauthorized access. You'are Event Organizer");
            return;
        }
        if (!eventParticipants?.find((participant: any) => participant.address === wallet?.accounts[0]?.address)) {
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
    },[])

    return (
        <div className="h-full">
            {(eventDetails?.id && !loading) &&
                <main className="min-h-screen bg-white">
                    <div className="bg-white px-3 py-4 md:px-20 md:py-10 flex flex-col items-stretch">
                        <div className="flex w-full flex-col items-stretch ">
                            <div className="bg-gradient-to-r from-[#6d46c9] to-purple-600  p-6 flex w-full flex-col rounded-md max-md:max-w-full">
                                <div className="w-full max-md:max-w-full">
                                    <div className="flex gap-5 max-md:flex-col max-md:gap-0 w-full">
                                        <div className="flex flex-col w-full max-md:ml-0 max-md:w-full">
                                            <div className="flex flex-col grow justify-center md:py-10 md:px-5  text-white bg-gradient-to-l from-blue-500 to-purple-600">
                                                <div className="flex justify-center items-center">
                                                    <img
                                                        alt="event_logo"
                                                        src={`https://ipfs.io/ipfs/${formatIPFS(eventDetails?.logoUrl)}`}
                                                        className="object-cover"
                                                    />
                                                </div>

                                                {(wallet?.accounts[0]?.address === eventDetails?.organizer && eventDetails?.status < 2) &&
                                                    <div className="flex gap-2 md:gap-5 justify-center mx-2 md:mx-6 mt-10 text-base font-bold text-center max-md:max-w-full">
                                                        <button
                                                            disabled={eventDetails?.status === 1}
                                                            className=" w-1/2 bg-gradient-to-r from-[#5522CC] to-[#ED4690] hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF] disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 "
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
                                                {(wallet?.accounts[0]?.address === eventDetails?.organizer && eventDetails.status === 0) &&
                                                    <div className="flex gap-2 md:gap-5 justify-center mx-2 md:mx-6 mt-2 text-base font-bold text-center max-md:max-w-full">
                                                        <button
                                                            className=" w-full bg-gradient-to-r from-[#5522CC] to-[#ED4690] hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF] px-6 py-3 "
                                                            onClick={() => cancelEvent()}
                                                        >
                                                            Cancel Event
                                                        </button>
                                                    </div>
                                                }

                                                {(eventDetails.status === 0) &&
                                                    <div className="mx-2 md:mx-6 flex flex-col justify-center p-3 mt-3 md:mt-6 bg-white text-black max-md:px-5">
                                                        <div className="flex flex-col gap-3 md:gap-5 justify-between max-md:max-w-full">
                                                            <p className="flex justify-center items-center mx-auto gap-2 text-base">
                                                                {" "}
                                                                Minimum Ticket Price:{" "}
                                                                <span>
                                                                    {minimumPrice(JSON.parse(eventDetails.tickets))}ETH
                                                                </span>{" "}
                                                            </p>

                                                            <button
                                                                className="bg-gradient-to-r from-[#5522CC] to-[#ED4690] hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF] text-white font-bold flex items-center justify-center h-12 p-4 shadow-lg cursor-pointer"
                                                                onClick={() => buyTicket()}

                                                            >
                                                                Buy Ticket
                                                            </button>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </div>

                                        <div className="flex flex-col w-full max-md:ml-0 pb-5 max-md:w-full bg-gradient-to-l from-blue-500 to-purple-600  ">
                                            <div className="flex flex-col justify-center  w-full text-base  max-md:mt-8 max-md:max-w-full ">
                                                <div className="flex gap-2 justify-start px-8 py-6 text-md md:text-xl font-bold text-white   max-md:px-5 max-md:max-w-full bg-gradient-to-r from-[#5522CC] to-[#ED4690] ">
                                                    <span>
                                                        Event Details
                                                    </span>
                                                    <span>
                                                        -
                                                    </span>
                                                    <span>
                                                        {eventDetails?.title}
                                                    </span>
                                                </div>

                                                <div className="px-5 md:px-8 text-base md:text-base text-white">
                                                    {eventDetails?.status === 1 &&
                                                        <div className="pt-2 font-sans text-lg text-red-700">
                                                            This Event is ongoing!!!
                                                        </div>
                                                    }
                                                    {eventDetails?.status === 3 &&
                                                        <div className="pt-2 font-sans text-lg text-red-700">
                                                            ooops! This Event has been cancelled!!!
                                                        </div>
                                                    }
                                                    {eventDetails?.status === 2 &&
                                                        <div className="pt-2 font-sans text-lg text-red-700">
                                                            ooops! This Event has ended!!!
                                                        </div>
                                                    }
                                                    <div className="pt-2 font-sans">
                                                        Location: {eventDetails?.location}
                                                    </div>
                                                    <div className="pt-2 font-sans">
                                                        Start Date: {moment(eventDetails?.date).format('MMMM Do YYYY, h:mm:ss a')}
                                                    </div>
                                                    <div className="pt-2 font-sans">
                                                        Maximum Capacity: {eventDetails?.capacity}
                                                    </div>
                                                    {eventDetails?.dao === 1 &&
                                                        <div className="pt-2 font-sans">This Event allows the creation/voting of proposals.</div>
                                                    }
                                                    {eventDetails?.referral === 1 &&
                                                        <div className="pt-2 font-sans">{`This Event gives referral code at the purchase of ticket and offer ${eventDetails?.referralDiscount}% reward when you get ${eventDetails?.minReferrals} referrals`}.</div>
                                                    }
                                                </div>
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
                                {!showParticipantTable && wallet?.accounts && eventDetails?.dao === 1 && eventDetails?.status === 0 &&
                                    <div className="flex flex-row justify-between mt-6 md:mx-2 text-white ">
                                        <div className="w-full flex md:justify-end">
                                            <button
                                                className="w-fit bg-gradient-to-r from-[#5522CC] to-[#ED4690] hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF] px-6 py-2 text-lg font-medium"
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
                                <BuyTicketModal
                                    id={Number(id)}
                                    isVisible={showModal}
                                    balance={state?.balance}
                                    setBalance={setBalance}
                                    organizer={eventDetails.organizer}
                                    capacity={eventDetails.capacity}
                                    referral={eventDetails.referral}
                                    eventReferrals={eventReferrals}
                                    purchased_tickets={eventParticipants}
                                    tickets={JSON.parse(eventDetails.tickets)}
                                    setEventParticipants={setEventParticipants}
                                    onClose={() => setShowModal(false)}
                                />

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
                                    />
                                    <CancelEventModal
                                        isVisible={
                                            showCancelEventModal
                                        }
                                        id={Number(id)}
                                        onClose={() =>
                                            setShowCancelEventModal(
                                                false
                                            )
                                        }
                                        eventDetails={eventDetails}
                                        setEventDetails={setEventDetails}
                                    />
                                </div>

                                <NewProposalModal
                                    isVisible={showNewProposalModal}
                                    onClose={() =>
                                        setShowNewProposalModal(false)
                                    }
                                    setEventProposals={setEventProposals}
                                    eventProposals={eventProposals}
                                    id={Number(id)}
                                />

                                {showParticipantTable ? (
                                    <ParticipantTable eventParticipants={eventParticipants} />
                                ) : (
                                    <ProposalTable
                                        event_organizer={eventDetails?.organizer}
                                        eventProposals={eventProposals}
                                        event_id={Number(id)}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            }
            {(!eventDetails?.id && loading) &&

                <div className="h-full flex flex-col">
                    <div className="w-full bg-[#EEE1FF] h-2"></div>

                    <div className="bg-base-100 h-full py-8 px-10 md:px-24 bg-gradient-to-l from-[#5522CC] to-[#ED4690]">

                        <div
                            className="text-white font-medium text-lg md:text-3xl mt-10 "
                        >
                            <h3>Fetching Event Details</h3>
                        </div>
                    </div>
                </div>
            }
            {(!eventDetails?.id && !loading) &&

                <div className="h-full flex flex-col">
                    <div className="w-full bg-[#EEE1FF] h-2"></div>

                    <div className="bg-base-100 h-full py-8 px-10 md:px-24 bg-gradient-to-l from-[#5522CC] to-[#ED4690]">

                        <div
                            className="text-white font-medium text-lg md:text-3xl mt-10 "
                        >
                            <h3>Invalid Event</h3>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default EventDetails;
