import React, { useContext, useState } from "react";
import { useRollups } from "../../useRollups";
import { DappAddress } from "../../constants";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { useConnectWallet } from "@web3-onboard/react";
import { GlobalContext } from "../../context/GlobalContext";

type Props = {
    isVisible: boolean;
    id: number;
    balance: any;
    setBalance: any;
    capacity: number;
    purchased_tickets: any;
    organizer: string;
    onClose: boolean | void | string | any;
    tickets: any;
    referral: number;
    setEventParticipants: any;
    eventReferrals: any;
};

const BuyTicketModal = ({ isVisible, onClose, tickets, id, balance, setBalance, organizer, capacity, referral, eventReferrals, purchased_tickets, setEventParticipants }: Props) => {
    const [processing, setProcessing] = useState<boolean>(false)
    const [ticketId, setTicketId] = useState<number>(0)
    const [referralCode, setReferralCode] = useState<number>(0)
    const rollups = useRollups(DappAddress);
    const [{ wallet }] = useConnectWallet();
    const { state, dispatch }: any = useContext(GlobalContext);


    const processTicket = async (ticket_details: any) => {
        if (wallet?.accounts[0]?.address === organizer) {
            toast.error("Unauthorized access. You are Event Organizer")
            return;
        }

        if (Number(balance) < Number(ticket_details?.price)) {
            toast.error("Insufficient Funds. Please Deposit into the DAPP")
            return;
        }
        if (capacity === purchased_tickets?.length) {
            toast.error("Event has reached it's capacity")
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
                dispatch({
                    type: "SET_BALANCE",
                    payload: (Number(state.balance) - Number(ticket_details?.price)).toString(),
                });
                setBalance(ticket_details?.price.toString())
                toast.success("Event ticket purchased successfully")
                setProcessing(false);
                setEventParticipants([...purchased_tickets, { "id": purchased_tickets[purchased_tickets.length - 1] ? purchased_tickets[purchased_tickets.length - 1].id + 1 : 1, "event_id": id, "ticket_type_id": ticket_details?.id, "purchased_time": new Date(), "ticket_type": ticket_details?.ticketType, "address": wallet?.accounts[0]?.address, "refunded": false, "claimedNFT": false }]);
                onClose();
            } catch (error) {
                console.log("error", error)
                setProcessing(false)
            }
        }
        setProcessing(false)

    }

    const processTicketReferral = async (ticket_details: any) => {
        if (capacity === purchased_tickets?.length) {
            toast.error("Event has reached it's capacity")
            return;
        }
        if (wallet?.accounts[0]?.address === organizer) {
            toast.error("Unauthorized access. You are Event Organizer")
            return;
        }
        if (Number(referralCode) > 0 && !eventReferrals?.find((referral: any) => Number(referral?.code) === Number(referralCode))?.code) {
            toast.error("Invalid Event Referral Code")
            return;
        }
        if (Number(balance) <= Number(ticket_details?.price)) {
            toast.error("Insufficient Funds. Please Deposit into the DAPP")
            return;
        }
        if (rollups) {
            console.log(referralCode)
            setTicketId(ticket_details?.id)
            try {
                setProcessing(true);
                let str = `{"action": "purchase_ticket", "id": ${id}, "ticket":${ticket_details?.id}, "purchased_time": "${new Date()}", "ticket_type":"${ticket_details?.ticketType}", "referral_code":"${referralCode}"}`
                let data = ethers.utils.toUtf8Bytes(str);

                const result = await rollups.inputContract.addInput(DappAddress, data);
                const receipt = await result.wait(1);
                // Search for the InputAdded event
                const event = receipt.events?.find((e: any) => e.event === "InputAdded");
                dispatch({
                    type: "SET_BALANCE",
                    payload: (Number(state.balance) - Number(ticket_details?.price)).toString(),
                });
                setBalance((Number(state.balance) - Number(ticket_details?.price)).toString())
                toast.success("Event ticket purchased successfully")
                setProcessing(false);
                setEventParticipants([...purchased_tickets, { "id": purchased_tickets[purchased_tickets.length - 1] ? purchased_tickets[purchased_tickets.length - 1].id + 1 : 1, "event_id": id, "ticket_type_id": ticket_details?.id, "purchased_time": new Date(), "ticket_type": ticket_details?.ticketType, "address": wallet?.accounts[0]?.address, "refunded": false, "claimedNFT": false }]);
                onClose();
            } catch (error) {
                console.log("error", error)
                setProcessing(false)
            }
        }
    }

    if (!isVisible) return null;

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
                            <h2 className="text-white font-bold text-xl">
                                Select Your Preferred Ticket Type
                            </h2>
                            {referral === 1 &&
                                <div className="grid text-lg items-center mt-3">
                                    <label htmlFor="referalCode" className="text-white text-base font-bold">
                                        Referral Code (optional)
                                    </label>
                                    <input
                                        value={referralCode}
                                        onChange={(e: any) => setReferralCode(e.target.value)}
                                        className="bg-white outline-none px-4 py-2 text-black text-base mt-2"
                                        type="text"
                                        placeholder="Your Referral Code (Optional)"
                                    />
                                </div>
                            }

                            <div className="flex flex-wrap flex-row mt-1 justify-between gap-4 py-6 text-white">
                                {tickets.length > 0 && tickets.map((item: any, index: number) => (
                                    <div key={index} className="pt-2 min-w-[200px] text-center justify-center space-y-4 flex flex-col w-full border shadow-2xl">
                                        <p className="text-2xl">{item.ticketType}</p>
                                        <p className="text-xs font-black mb-2 block">{item.price}ETH</p>
                                        <button
                                            disabled={processing}
                                            className="disabled:cursor-not-allowed shadow-2xl text-lg m-0 font-semibold justify-center px-2 py-2.5 text-white  bg-gradient-to-l from-[#5522CC] to-[#ED4690] hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]"
                                            onClick={() => referral ? processTicketReferral(item) : processTicket(item)}
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
                    </div>
                </div>
            </div>
        </>
    );
};

export default BuyTicketModal;
