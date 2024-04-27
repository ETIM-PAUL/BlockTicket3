import React, { Suspense, lazy, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { NavLink } from "react-router-dom";
import { EventsData } from "../constants";
import { Link, useParams } from "react-router-dom";
import WalletConnect from "./WalletConnect";
import Logo from "./Logo";
import ProposalTable from "./ProposalTable";
import { PurchaseHistory } from "../constants";
import { shortenAddress } from "../utils";
import BuyTicketModal from "./modals/BuyTicketModal";
import TicketPurchaseModal from "./modals/TicketPurchaseModal";
import StartEventModal from "./modals/StartEventModal";
import EndEventModal from "./modals/EndEventModal";
import NewProposalModal from "./modals/NewProposalModal";
import ParticipantModal from "./modals/ParticipantModal";
import ParticipantTable from "./ParticipantTable";

// import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const EventDetails = () => {
    // Get the id from the URL
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [profileModal, setProfileModal] = useState(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showStartEventModal, setShowStartEventModal] =
        useState<boolean>(false);
    const [showEndEventModal, setShowEndEventModal] = useState<boolean>(false);
    const [showNewProposalModal, setShowNewProposalModal] =
        useState<boolean>(false);
    const [showParticipantsModal, setShowParticipantsModal] =
        useState<boolean>(false);
    const [showParticipantTable, setShowParticipantTable] = useState(false);

    // Function to toggle between showing the proposal table and the participant table

    const showProposalTable = () => {
        setShowParticipantTable(false);
    };

    const showParticipant = () => {
        setShowParticipantTable(true);
    };

    // Find the company with the matching id
    const eventData = EventsData.find((eventData) => eventData.id === id);

    // If no eventData was found, show a message
    if (!eventData) {
        return <div>No eventData found with this ID.</div>;
    }

    return (
        <>
            <div className="navbar bg-base-100 p-8 bg-gradient-to-r from-[#5522CC] to-[#ED4690]">
                <div className="flex-1 ml-12 ">
                    <Logo />
                </div>
                <div className="flex mr-14 gap-10  ">
                    <Link
                        to="/events"
                        className="font-medium rounded-lg text-xl px-4 py-3 text-center bg-white text-black"
                    >
                        All Events
                    </Link>

                    <WalletConnect />
                </div>
            </div>

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
                                                    src={eventData.eventLogo}
                                                    className="w-1/2"
                                                />
                                            </div>

                                            <div className="flex gap-3 md:gap-5 justify-center mx-6 mt-10 text-base font-bold text-center max-md:flex-wrap max-md:mr-2.5 max-md:max-w-full">
                                                <button
                                                    className=" w-1/2 bg-gradient-to-r from-[#5522CC] to-[#ED4690] hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF] px-6 py-3 "
                                                    onClick={() =>
                                                        setShowStartEventModal(
                                                            true
                                                        )
                                                    }
                                                >
                                                    Start Event
                                                </button>

                                                <button
                                                    className="w-1/2 bg-gradient-to-r from-[#5522CC] to-[#ED4690] hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF] px-6 py-3 "
                                                    onClick={() =>
                                                        setShowEndEventModal(
                                                            true
                                                        )
                                                    }
                                                >
                                                    End Event
                                                </button>
                                            </div>

                                            {/* Modals */}
                                            <div className="">
                                                <StartEventModal
                                                    isVisible={
                                                        showStartEventModal
                                                    }
                                                    onClose={() =>
                                                        setShowStartEventModal(
                                                            false
                                                        )
                                                    }
                                                />

                                                <EndEventModal
                                                    isVisible={
                                                        showEndEventModal
                                                    }
                                                    onClose={() =>
                                                        setShowEndEventModal(
                                                            false
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className=" mx-6 flex flex-col justify-center p-3 mt-0 md:mt-6 bg-white text-black max-md:px-5">
                                                <div className="flex flex-col gap-3 md:gap-5 justify-between max-md:max-w-full">
                                                    <p className="flex justify-center items-center mx-auto gap-4 text-xl">
                                                        {" "}
                                                        Minimum Ticket Price{" "}
                                                        <span>
                                                            {eventData.price}
                                                        </span>{" "}
                                                    </p>

                                                    <button
                                                        className="bg-gradient-to-r from-[#5522CC] to-[#ED4690] hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF] text-white text-xl font-bold flex items-center justify-center w-full h-12 p-4 shadow-lg cursor-pointer  mt-6"
                                                        onClick={() =>
                                                            setShowModal(true)
                                                        }
                                                    >
                                                        Buy Ticket
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/*  */}
                                        <BuyTicketModal
                                            isVisible={showModal}
                                            onClose={() => setShowModal(false)}
                                        />

                                        {/*  */}
                                    </div>

                                    <div className="flex flex-col w-full max-md:ml-0 max-md:w-full bg-gradient-to-l from-blue-500 to-purple-600  ">
                                        <div className="flex flex-col justify-center  w-full text-base  max-md:mt-8 max-md:max-w-full ">
                                            <div className="justify-center px-8 py-6  text-md md:text-xl font-bold text-white   max-md:px-5 max-md:max-w-full bg-gradient-to-r from-[#5522CC] to-[#ED4690] ">
                                                Purchase History
                                            </div>

                                            {PurchaseHistory.slice(-5).map(
                                                (purchase, index) => (
                                                    <div
                                                        key={index}
                                                        className={`flex flex-col justify-center px-8 py-6 border-b border-solid bg-gradient-to-l from-blue-500 to-purple-600  max-md:max-w-full ${
                                                            index === 4
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
                            <div className="self-start mt-12 text-md md:text-xl font-bold text-white max-md:mt-10">
                                Event Proposals
                            </div>
                            <div className="flex text-lg font-normal gap-4 ">
                                <button
                                    className={`flex justify-center mt-4 py-2 max-w-full text-black ${
                                        !showParticipantTable
                                            ? "bg-gradient-to-r from-[#5522CC] to-[#ED4690] hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]"
                                            : "bg-white text-black hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]"
                                    } w-[130px] text-lg font-medium`}
                                    onClick={showProposalTable}
                                >
                                    Proposals
                                </button>
                                <button
                                    className={`flex justify-center mt-4 py-2 max-w-full text-black ${
                                        showParticipantTable
                                            ? "bg-gradient-to-r from-[#5522CC] to-[#ED4690] hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]"
                                            : "bg-white text-black hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]"
                                    } w-[130px] text-lg font-medium`}
                                    onClick={showParticipant}
                                >
                                    Participants{" "}
                                </button>
                            </div>
                            <div className="flex flex-row justify-between mt-6 mx-2 text-white ">
                                <h3 className=" text-lg font-medium">
                                    All Proposal
                                </h3>

                                <button
                                    className="bg-gradient-to-r from-[#5522CC] to-[#ED4690] hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF] px-6 py-2 text-lg mb-4 font-medium"
                                    onClick={() =>
                                        setShowNewProposalModal(true)
                                    }
                                >
                                    Add New Proposal
                                </button>

                                {/*Modal  */}

                                <NewProposalModal
                                    isVisible={showNewProposalModal}
                                    onClose={() =>
                                        setShowNewProposalModal(false)
                                    }
                                />
                            </div>

                            {showParticipantTable ? (
                                <ParticipantTable />
                            ) : (
                                <ProposalTable />
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default EventDetails;
