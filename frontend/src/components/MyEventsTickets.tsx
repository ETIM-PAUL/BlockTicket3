import React, { useState } from "react";
import { useNavigate } from "react-router";
import ClaimNFTModal from "./modals/ClaimNFTModal";
import GetRefundModal from "./modals/GetRefundModal";
import { toast } from "react-toastify";
import NFTModal from "./modals/NFTModal";

type Props = {
    nfts: any;
    tickets: any;
    referrals: any;
    events: any;
};

const MyEventsTickets = ({ tickets, referrals, events, nfts }: Props) => {
    const navigate = useNavigate();
    const [allEvents, setAllEvents] = useState<any>(events);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedTicket, setSelectedTicket] = useState<any>();
    const [selectedNFT, setSelectedNFT] = useState<any>();
    const [claimNFTModal, setClaimNFTModal] = useState<boolean>(false);
    const [nFTModal, setNFTModal] = useState<boolean>(false);
    const [refundModal, setRefundModal] = useState<boolean>(false);


    function getEventDetails(id: number, type: string) {
        const eventDetails = allEvents.find((event: any) => event.id === id);
        if (type === "tokenUrl") {
            return eventDetails?.tokenUrl;
        }
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
    function showNFT() {
        setNFTModal(true);
    }
    function showRefundModal() {
        setRefundModal(true);
    }

    function isNFTMinted(event_id: any, ticket_id: any) {
        const nft_url = nfts.find((nft: any) => (Number(nft?.eventid) === event_id) && (Number(nft?.ticketid) === ticket_id));
        return nft_url
    }

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
                                    <td>{getEventDetails(ticket.event_id, "title")}</td>
                                    <td>{ticket.ticket_type}</td>
                                    <td>{getEventDetails(ticket.event_id, "status")}</td>
                                    <td>{referrals?.find((referral: any) => referral?.ticket_id === ticket.id)?.count ?? "N/A"}</td>
                                    <td>{referrals?.find((referral: any) => referral?.ticket_id === ticket.id)?.code ?? "N/A"}</td>
                                    <td className="space-x-1 lg:space-x-2 items-center">
                                        <button onClick={() => navigate(`/event-details/${ticket.event_id}`)} className="bg-gradient-to-r from-[#5522CC] to-[#ED4690]  text-white hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF] text-xs font-bold p-1">View Event</button>
                                        {(getEventStatus(ticket.event_id) === 2) &&
                                            <button disabled={ticket.claimedNFT === 1} onClick={() => { setSelectedTicket(ticket); showNFTModal() }} className="bg-gradient-to-r from-[#5522CC] to-[#ED4690]  text-white hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF] text-xs font-bold p-1">{ticket.claimedNFT === 1 ? "NFT Claimed" : "Claim POAP(NFT)"}</button>
                                        }
                                        {(isNFTMinted(ticket.event_id, ticket.id)) &&
                                            <button onClick={() => { setSelectedNFT(getEventDetails(ticket.event_id, "tokenUrl")); showNFT(); }} className="bg-gradient-to-r from-[#5522CC] to-[#ED4690]  text-white hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF] text-xs font-bold p-1">View NFT</button>
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
                                            <button disabled={ticket.claimedNFT === 1} onClick={() => { setSelectedTicket(ticket); showNFTModal() }} className="w-full bg-gradient-to-r from-[#5522CC] to-[#ED4690]  text-white hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF] text-xs font-bold p-1">{ticket.claimedNFT === 1 ? "NFT Claimed" : "Claim POAP(NFT)"}</button>
                                        }
                                        {isNFTMinted(ticket.event_id, ticket.id) &&
                                            <button onClick={() => { setSelectedNFT(getEventDetails(ticket.event_id, "tokenUrl")); showNFT(); }} className="bg-gradient-to-r from-[#5522CC] to-[#ED4690]  text-white hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF] text-xs font-bold p-1">View NFT</button>
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
            {selectedTicket?.id &&
                <ClaimNFTModal
                    isVisible={claimNFTModal}
                    onClose={() =>
                        setClaimNFTModal(false)
                    }
                    walletNavigate={() =>
                        navigate("/my-wallet")
                    }
                    id={Number(selectedTicket?.event_id)}
                    ticket_id={Number(selectedTicket?.id)} />
            }
            {selectedNFT &&
                <NFTModal
                    nft_url={selectedNFT}
                    isVisible={nFTModal}
                    onClose={() =>
                        setNFTModal(false)
                    } />
            }
            {selectedTicket?.id &&
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
            }
        </div>
    );
};
// 300501
export default MyEventsTickets;
