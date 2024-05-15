import React, { useEffect, useState } from "react";
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
    referral: number;
    fetchEventDetails: any;
    eventReferrals: any;
};

const config: any = configFile;
interface Report {
    payload: string;
}

const BuyTicketModal = ({ isVisible, onClose, tickets, id, organizer, referral, fetchEventDetails, eventReferrals }: Props) => {
    const [processing, setProcessing] = useState<boolean>(false)
    const [ticketId, setTicketId] = useState<number>(0)
    const [referralCode, setReferralCode] = useState<number>(0)
    const [balance, setBalance] = useState<string>()
    const rollups = useRollups(DappAddress);
    const [{ wallet }] = useConnectWallet();
    const [{ connectedChain }] = useSetChain();
    const [postData, setPostData] = useState<boolean>(false);


    const processTicket = async (ticket_details: any) => {
        if (wallet?.accounts[0]?.address === organizer) {
            toast.error("Unauthorized access. You are Event Organizer")
            return;
        }
        if (Number(balance) < Number(ticket_details?.price)) {
            toast.error("Insufficient Funds. Please Deposit into the DAPP")
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
        setProcessing(false)

    }
    const processTicketReferral = async (ticket_details: any) => {
        if (wallet?.accounts[0]?.address === organizer) {
            toast.error("Unauthorized access. You are Event Organizer")
            return;
        }
        if (Number(balance) <= Number(ticket_details?.price)) {
            toast.error("Insufficient Funds. Please Deposit into the DAPP")
            return;
        }
        if (rollups) {
            setTicketId(ticket_details?.id)
            try {
                setProcessing(true);
                let str = `{"action": "purchase_ticket", "id": ${id}, "ticket":${ticket_details?.id}, "purchased_time": "${new Date()}", "ticket_type":"${ticket_details?.ticketType}", "referral_code":${referralCode}}`
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

    const getBalance = async (str: string) => {
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
                const reportData: any = JSON.parse(decode)
                setBalance(ethers.utils.formatEther(reportData?.ether))
                //console.log(parseEther("1000000000000000000", "gwei"))
            });
    };

    useEffect(() => {
        getBalance(`balance/${wallet?.accounts[0]?.address}`)
    }, [])

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
                                {tickets.length > 0 && tickets.map((item: any) => (
                                    <div key={item.name} className="pt-2 min-w-[200px] text-center justify-center space-y-4 flex flex-col w-full border shadow-2xl">
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
