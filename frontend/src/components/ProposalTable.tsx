import React, { useState } from "react";
import VoteModal from "./modals/VoteModal";

type Props = {
    event_id: any;
    fetchEventDetails: any;
    eventProposals: any;
};

const ProposalTable = ({ eventProposals, fetchEventDetails, event_id }: Props) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    return (
        <div className="mt-4">
            <div className="flex overflow-x-auto">
                {eventProposals.length === 0 ?
                    <div
                        className="text-white text-lg font-bold md:text-xl mt-2 pl-2"
                    >
                        <h3>No Proposals Yet</h3>
                    </div>

                    :
                    <table className=" flex table  text-white -space-y-4 ">
                        <thead className="text-black font-semibold text-base bg-white">
                            <tr>
                                <th>Id</th>
                                <th>Proposal</th>
                                <th>UpVotes</th>
                                <th>DownVotes</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-base">
                            {eventProposals.map((proposalData: any) => (
                                <tr
                                    key={proposalData.id}
                                    className={
                                        proposalData.id % 2 === 0
                                            ? "bg-[#9b76f2]"
                                            : "bg-[#8155ea]"
                                    }
                                >
                                    <td>{proposalData.id}</td>
                                    <td>{proposalData.proposal}</td>
                                    <td>{proposalData.upvotes}</td>
                                    <td>{proposalData.downvotes}</td>
                                    <td>
                                        <button
                                            className="bg-gradient-to-r from-[#5522CC] to-[#ED4690]  text-white hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF] text-xs font-bold p-1"
                                            onClick={() => setShowModal(true)}
                                        >
                                            Action
                                        </button>
                                    </td>

                                    <div className="">
                                        <VoteModal
                                            event_id={event_id}
                                            proposal={proposalData}
                                            fetchEventDetails={fetchEventDetails}
                                            isVisible={showModal}
                                            onClose={() => setShowModal(false)}
                                        />
                                    </div>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                }
            </div>
        </div>
    );
};

export default ProposalTable;
