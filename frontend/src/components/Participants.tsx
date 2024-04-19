import React, { useState } from "react";
import { ParticipantsData } from "../constants";
import { shortenAddress } from "../utils";

type Props = {};

const Participants = (props: Props) => {
    return (
        <div className="mt-4">
            <div className="flex overflow-x-auto">
                <table className=" flex table  text-white -space-y-4 ">
                    <thead className="text-white font-semibold text-base bg-black ">
                        <tr>
                            <th>Id</th>
                            <th>Participants</th>
                            <th>ticket Type</th>
                            <th>Referals</th>
                            <th>Referal Code</th>
                        </tr>
                    </thead>
                    <tbody className="">
                        {ParticipantsData.map((participantData: any) => (
                            <tr
                                key={participantData.id}
                                className={
                                    participantData.id % 2 === 0
                                        ? "bg-[#292929]"
                                        : "bg-[#343434]"
                                }
                            >
                                <td>{participantData.id}</td>
                                <td>
                                    {shortenAddress(participantData.address)}
                                </td>
                                <td>{participantData.ticketType}</td>
                                <td>{participantData.referalCount}</td>
                                <td>{participantData.referalCode}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Participants;
