import React, { useState } from "react";
import { ParticipantsData } from "../constants";
import { shortenAddress } from "../utils";

type Props = {};

const ParticipantTable = (props: Props) => {
    return (
        <div className="mt-4">
            <div className="flex overflow-x-auto">
                <table className=" flex table  text-white -space-y-4 h-[100px] ">
                    <thead className="text-black font-semibold text-lg bg-white">
                        <tr>
                            <th>Id</th>
                            <th>Participants</th>
                            <th>Ticket Type</th>
                            <th>Time Purchased</th>
                        </tr>
                    </thead>
                    <tbody className="text-lg">
                        {ParticipantsData.map((participantData: any) => (
                            <tr
                                key={participantData.id}
                                className={
                                    participantData.id % 2 === 0
                                        ? "bg-[#9b76f2]"
                                        : "bg-[#8155ea]"
                                }
                            >
                                <td>{participantData.id}</td>
                                <td>
                                    {shortenAddress(participantData.address)}
                                </td>
                                <td>{participantData.ticketType}</td>
                                <td>{participantData.time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ParticipantTable;
