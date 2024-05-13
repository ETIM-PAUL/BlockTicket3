import React, { useState } from "react";
import TicketPurchaseModal from "./TicketPurchaseModal";
import { useRollups } from "../../useRollups";
import { DappAddress } from "../../constants";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { useConnectWallet, useSetChain } from "@web3-onboard/react";
import configFile from "../../config.json";

type Props = {
    isVisible: boolean;
    id: number;
    organizer: string;
    onClose: boolean | void | string | any;
    tickets: any;
    referral: boolean;
    fetchEventDetails: any;
    eventReferrals: any;
};

const config: any = configFile;
interface Report {
    payload: string;
}

const BuyTicketModal = ({ isVisible, onClose, tickets, id, organizer, referral, fetchEventDetails, eventReferrals }: Props) => {
    const [showTicketModal, setShowTicketModal] = useState<boolean>(false);
    const [processing, setProcessing] = useState<boolean>(false)
    const [ticketId, setTicketId] = useState<number>(0)
    const [referralCode, setReferralCode] = useState<number>(0)
    const [selectedTicket, setSelectedTicket] = useState<any>()
    const rollups = useRollups(DappAddress);
    const [{ wallet }] = useConnectWallet();
    const [{ connectedChain }] = useSetChain();

    if (!isVisible) return null;

    const purchaseTicket = async (ticket_details: any) => {
        if (wallet?.accounts[0]?.address === organizer) {
            toast.error("Unauthorized access. You are Event Organizer")
            return;
        }
        setSelectedTicket(ticket_details)
        setShowTicketModal(true)
    };

    const processTicket = async (ticket_details: any) => {
        if (wallet?.accounts[0]?.address === organizer) {
            toast.error("Unauthorized access. You are Event Organizer")
            return;
        }
        if (rollups) {
            setTicketId(ticket_details?.id)
            try {
                setProcessing(true);
                let str = `{"action": "purchase_ticket", "id": ${id}, "ticket":${ticket_details?.id}, "purchased_time": "${new Date()}", "ticket_type":"${ticket_details?.ticketType}"}`
                let data = ethers.utils.toUtf8Bytes(str);

                const result = await rollups.inputContract.addInput(DappAddress, data);
                const receipt = await result.wait(1);
                // Search for the InputAdded event
                const event = receipt.events?.find((e: any) => e.event === "InputAdded");
                toast.success("Event ticket purchased successfully")
                setProcessing(false);
                fetchEventDetails();
                onClose();
            } catch (error) {
                console.log("error", error)
                setProcessing(false)
            }
        }
    }
    const processTicketReferral = async () => {
        if (referralCode && eventReferrals && !eventReferrals?.find((code: any) => code?.code === Number(referralCode))) {
            toast.error("Invalid event referral code")
            return;
        }
        if (wallet?.accounts[0]?.address === organizer) {
            toast.error("Unauthorized access. You are Event Organizer")
            return;
        }
        if (rollups) {
            setTicketId(selectedTicket?.id)
            try {
                setProcessing(true);
                let str = `{"action": "purchase_ticket", "id": ${id}, "ticket":${selectedTicket?.id}, "purchased_time": "${new Date()}", "ticket_type":"${selectedTicket?.ticketType}", "referral_code":${referralCode}}`
                let data = ethers.utils.toUtf8Bytes(str);

                const result = await rollups.inputContract.addInput(DappAddress, data);
                const receipt = await result.wait(1);
                // Search for the InputAdded event
                const event = receipt.events?.find((e: any) => e.event === "InputAdded");
                toast.success("Event ticket purchased successfully")
                setProcessing(false);
                fetchEventDetails();
                onClose();
            } catch (error) {
                console.log("error", error)
                setProcessing(false)
            }
        }
    }

    return (
        <>
            <div className="fixed inset-0 z-10 items-center justify-center bg-[#292929] bg-opacity-75"></div>

            <div
                className="fixed inset-0 flex justify-center items-center z-50"
                id="wrapper"
            >
                <div className="md:w-[650px] backdrop-blur-none z-50 flex flex-col relative ">
                    <div className=" p-6 rounded relative">
                        <button
                            className="text-black bg-white text-sm font-bold b-white border rounded-[50%] w-8 h-8 absolute top-20 right-10"
                            onClick={() => onClose()}
                        >
                            X
                        </button>
                        <div className="bg-gradient-to-r from-[#5522CC] to-[#ED4690] z-50 mx-auto flex flex-col mt-10 px-10 pt-16 pb-3">
                            <h2 className="text-white font-bold text-xl text-center font-nexa">
                                Select Your Preferred Ticket Type
                            </h2>

                            <div className="flex flex-wrap flex-row mt-1 justify-between gap-4 py-6 text-white">
                                {tickets.length > 0 && tickets.map((item: any) => (
                                    <div key={item.name} className="pt-2 max-w-[200px] text-center justify-center space-y-4 flex flex-col w-full border shadow-2xl">
                                        <p className="text-2xl">{item.ticketType}</p>
                                        <p className="text-xs font-black mb-2 block">{item.price}ETH</p>
                                        <button
                                            disabled={processing}
                                            className="disabled:cursor-not-allowed shadow-2xl text-lg m-0 font-semibold justify-center px-2 py-2.5 text-white  bg-gradient-to-l from-[#5522CC] to-[#ED4690] hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]"
                                            onClick={() => referral ? purchaseTicket(item) : processTicket(item)}
                                        >
                                            {(!processing) ?
                                                "Purchase"
                                                :
                                                (item?.id === ticketId) ? "Processing" : "Purchase"
                                            }
                                        </button>
                                    </div>
                                ))

                                }

                            </div>
                        </div>
                        {/*  */}

                        <TicketPurchaseModal
                            isVisible={showTicketModal}
                            setReferralCode={setReferralCode}
                            onSubmit={() => processTicketReferral()}
                            onClose={() => setShowTicketModal(false)}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default BuyTicketModal;
