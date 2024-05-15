import React from "react";
import { shortenAddress } from "../utils";
import moment from "moment";

type Props = {
    eventParticipants: any;
};

const ParticipantTable = ({ eventParticipants }: Props) => {
    return (
        <div className="mt-4">
            <div className="flex overflow-x-auto">
                {eventParticipants.length === 0 ?
                    <div
                        className="text-white text-lg font-bold md:text-xl mt-2 pl-2"
                    >
                        <h3>No Ticket Purchase Yet</h3>
                    </div>

                    :
                    <table className=" flex table  text-white -space-y-4 ">
                        <thead className="text-black font-semibold text-base bg-white">
                            <tr>
                                <th>Id</th>
                                <th>Participant</th>
                                <th>Ticket Type</th>
                                <th>Date Purchased</th>
                            </tr>
                        </thead>
                        <tbody className="text-lg">
                            {eventParticipants.map((participantData: any) => (
                                <tr
                                    key={participantData?.id}
                                    className={
                                        participantData?.id % 2 === 0
                                            ? "bg-[#9b76f2]"
                                            : "bg-[#8155ea]"
                                    }
                                >
                                    <td>{participantData?.id}</td>
                                    <td>
                                        {shortenAddress(participantData?.address)}
                                    </td>
                                    <td>{participantData?.ticket_type}</td>
                                    <td>{moment(participantData?.purchased_time).format('MMMM Do YYYY, h:mm:ss a')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                }
            </div>
        </div>
    );
};

export default ParticipantTable;
