import React, { useEffect, useState } from "react";
import { MyEventsTicketData } from "../constants";
import { useNavigate } from "react-router";
import { ethers } from "ethers";
import configFile from "../config.json";
import { useSetChain } from "@web3-onboard/react";
import ClaimNFTModal from "./modals/ClaimNFTModal";
import GetRefundModal from "./modals/GetRefundModal";
import { toast } from "react-toastify";

type Props = {
    tickets: any;
    referrals: any;
};
const config: any = configFile;
interface Report {
    payload: string;
}

const MyEventsTickets = ({ tickets, referrals }: Props) => {
    const navigate = useNavigate();
    const [{ connectedChain }] = useSetChain();
    const [postData, setPostData] = useState<boolean>(false);
    const [allEvents, setAllEvents] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedTicket, setSelectedTicket] = useState<any>();
    const [claimNFTModal, setClaimNFTModal] = useState<boolean>(false);
    const [refundModal, setRefundModal] = useState<boolean>(false);
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
                // Decode payload from each report
                const decode = data.reports.map((report: Report) => {
                    return ethers.utils.toUtf8String(report.payload);
                });
                const reportData = JSON.parse(decode)
                setAllEvents(reportData)
                setLoading(false);
            });
    }

    useEffect(() => {
        fetchEvents("get_all/")
    }, [])

    function getEventDetails(id: number, type: string) {
        const eventDetails = allEvents.find((event: any) => event.id === id);
        if (type === "title") {
            return eventDetails?.title;
        }
        if (type === "status") {
            return (eventDetails?.status === 1 ? "Ongoing" : eventDetails?.status === 0 ? "Pending" : eventDetails?.status !== 3 ? "Ended" : "Cancelled");
        }
        if (type === "title") {
            return eventDetails?.title;
        }
    }
    function getEventStatus(id: number): number {
        const eventDetails = allEvents.find((event: any) => Number(event.id) === Number(id));
        return eventDetails?.status;
    }
    function showNFTModal() {
        setClaimNFTModal(true);
    }
    function showRefundModal() {
        setRefundModal(true);
    }
    console.log(tickets)

    return (
        <div className="mt-10 pb-12">
            {tickets && tickets?.length === 0 && !loading &&
                <div
                    className="text-white font-medium text-lg md:text-3xl mt-10 "
                >
                    <h3>No Tickets</h3>
                </div>
            }

            {tickets && tickets?.length === 0 && loading &&
                <div
                    className="text-white font-medium text-lg md:text-3xl mt-10 "
                >
                    <h3>Fetching User Tickets</h3>
                </div>
            }
            {(tickets && tickets?.length > 0) &&
                <div className="md:flex overflow-x-auto hidden ">
                    <table className=" table  text-white -space-y-4 ">
                        <thead className="text-black font-semibold text-base bg-[#EEE1FF]">
                            <tr>
                                {/* <th>Id</th> */}
                                <th>Event Title</th>
                                <th>Ticket Type</th>
                                <th>Status</th>
                                <th>Referral Count</th>
                                <th>Referral Code</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-lg">
                            {tickets && tickets?.length > 0 && tickets.map((ticket: any) => (
                                <tr
                                    key={ticket.id}
                                    className={
                                        ticket.id % 2 === 0
                                            ? "bg-[#9b76f2]"
                                            : "bg-[#8155ea]"
                                    }
                                >
                                    {/* <td>{ticket.id}</td> */}
                                    <td>{getEventDetails(ticket.event_id, "title")}</td>
                                    <td>{ticket.ticket_type}</td>
                                    <td>{getEventDetails(ticket.event_id, "status")}</td>
                                    <td>{referrals?.find((referral: any) => referral?.ticket_id === ticket.id)?.count ?? "N/A"}</td>
                                    <td>{referrals?.find((referral: any) => referral?.ticket_id === ticket.id)?.code ?? "N/A"}</td>
                                    <td className="space-x-2 items-center">
                                        <button onClick={() => navigate(`/event-details/${ticket.event_id}`)} className="bg-gradient-to-r from-[#5522CC] to-[#ED4690]  text-white hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF] text-xs font-bold p-1">View Event</button>
                                        {getEventStatus(ticket.event_id) === 2 &&
                                            <button onClick={() => { setSelectedTicket(ticket); showNFTModal() }} className="bg-gradient-to-r from-[#5522CC] to-[#ED4690]  text-white hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF] text-xs font-bold p-1">Claim POAP(NFT)</button>
                                        }
                                        {(getEventStatus(ticket.event_id) === 3 && ticket.refunded !== 1) &&
                                            <button onClick={() => { setSelectedTicket(ticket); showRefundModal() }} className="bg-gradient-to-r from-[#5522CC] to-[#ED4690]  text-white hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF] text-xs font-bold p-1">Get Refund</button>
                                        }
                                        {(getEventStatus(ticket.event_id) === 3 && ticket.refunded === 1) &&
                                            <button onClick={() => toast.error("Ticket refunded already")} className="bg-gradient-to-r from-[#5522CC] to-[#ED4690]  text-white hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF] text-xs font-bold p-1">Refunded</button>
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            }
            {/* Mobile View */}
            {(tickets && tickets?.length) > 0 &&

                <div className="overflow-x-auto  ">
                    <table className=" md:hidden flex table  text-white w-full">
                        <thead className="text-black font-semibold text-base bg-[#EEE1FF]">
                            <tr>
                                {/* <th>Id</th> */}
                                <th>Event Title</th>
                                <th>Ticket Type</th>
                                <th>Status</th>
                                <th>Referral Count</th>
                                <th>Referral Code</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-base">
                            {tickets && tickets?.length > 0 && tickets.map((ticket: any) => (
                                <tr
                                    key={ticket.id}
                                    className={
                                        ticket.id % 2 === 0
                                            ? "bg-[#9b76f2]"
                                            : "bg-[#8155ea]"
                                    }
                                >
                                    {/* <td>{ticket.id}</td> */}
                                    <td>{getEventDetails(ticket.event_id, "title")}</td>
                                    <td>{ticket.ticket_type}</td>
                                    <td>{getEventDetails(ticket.event_id, "status")}</td>
                                    <td>{referrals?.find((referral: any) => referral?.ticket_id === ticket.id)?.count ?? "N/A"}</td>
                                    <td>{referrals?.find((referral: any) => referral?.ticket_id === ticket.id)?.code ?? "N/A"}</td>
                                    <td className="space-y-2 md:space-y-0 md:space-x-2 items-center">
                                        <button onClick={() => navigate(`/event-details/${ticket.event_id}`)} className="w-full bg-gradient-to-r from-[#5522CC] to-[#ED4690]  text-white hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF] text-xs font-bold p-1">View Event</button>
                                        {getEventStatus(ticket.event_id) === 2 &&
                                            <button onClick={() => { setSelectedTicket(ticket); showNFTModal() }} className="w-full bg-gradient-to-r from-[#5522CC] to-[#ED4690]  text-white hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF] text-xs font-bold p-1">Claim POAP(NFT)</button>
                                        }
                                        {(getEventStatus(ticket.event_id) === 3 && ticket.refunded !== 1) &&
                                            <button onClick={() => { setSelectedTicket(ticket); showRefundModal() }} className="bg-gradient-to-r from-[#5522CC] to-[#ED4690]  text-white hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF] text-xs font-bold p-1">Get Refund</button>
                                        }
                                        {(getEventStatus(ticket.event_id) === 3 && ticket.refunded === 1) &&
                                            <button onClick={() => toast.error("Ticket refunded already")} className="bg-gradient-to-r from-[#5522CC] to-[#ED4690]  text-white hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF] text-xs font-bold p-1">Refunded</button>
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            }

            <ClaimNFTModal
                isVisible={claimNFTModal}
                onClose={() =>
                    setClaimNFTModal(false)
                }
                fetchEventDetails={() =>
                    navigate("/my-wallet")
                }
                id={Number(selectedTicket?.event_id)}
                ticket_id={Number(selectedTicket?.ticket_id)} />
            <GetRefundModal
                isVisible={refundModal}
                onClose={() =>
                    setRefundModal(false)
                }
                fetchEventDetails={() =>
                    navigate("/my-wallet")
                }
                id={Number(selectedTicket?.event_id)}
                ticket_type_id={Number(selectedTicket?.ticket_type_id)}
                ticket_id={Number(selectedTicket?.id)} />
        </div>
    );
};
// 300501
export default MyEventsTickets;
