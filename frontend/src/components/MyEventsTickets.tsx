import React, { useState } from "react";
import { MyEventsTicketData } from "../constants";

type Props = {};

const MyEventsTickets = (props: Props) => {
    return (
        <div className="mt-10 pb-12">
            <div className="flex overflow-x-auto">
                <table className=" flex table  text-white -space-y-4 ">
                    <thead className="text-black font-semibold text-base bg-[#EEE1FF]">
                        <tr>
                            <th>Id</th>
                            <th>Event Title</th>
                            <th>Ticket Type</th>
                            <th>Status</th>
                            <th>Referral Count</th>
                            <th>Referral Code</th>
                        </tr>
                    </thead>
                    <tbody className="text-lg">
                        {MyEventsTicketData.map((myEventTicketData: any) => (
                            <tr
                                key={myEventTicketData.id}
                                className={
                                    myEventTicketData.id % 2 === 0
                                        ? "bg-[#9b76f2]"
                                        : "bg-[#8155ea]"
                                }
                            >
                                <td>{myEventTicketData.id}</td>
                                <td>{myEventTicketData.title}</td>
                                <td>{myEventTicketData.ticketType}</td>
                                <td>{myEventTicketData.status}</td>
                                <td>{myEventTicketData.referalCount}</td>
                                <td>{myEventTicketData.referalCode}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyEventsTickets;
