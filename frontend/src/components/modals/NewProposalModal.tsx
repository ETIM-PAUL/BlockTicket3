import React, { useState } from "react";

import NewProposalForm from "../NewProposalForm";

type Props = {
    tickets: any;
    isVisible: boolean;
    onClose: boolean | void | string | any;
};

const NewProposalModal = ({ isVisible, onClose, tickets }: Props) => {
    const [proposal, setProposal] = useState();
    if (!isVisible) return null;

    const handleClose = (e: any) => {
        onClose();
    };

    return (
        <>
            <div className="fixed inset-0 z-10 items-center justify-center bg-[#292929] bg-opacity-75"></div>

            <div
                className="fixed inset-0 flex justify-center px-8 items-center z-50"
                id="wrapper"
                onClick={handleClose}
            >
                <div className="w-full md:max-w-[800px]  bg-gradient-to-l from-[#5522CC] to-[#ED4690] flex flex-col relative ">
                    <div className=" md:p-14 rounded">

                        <div className="bg-gradient-to-r from-[#5522CC] to-[#ED4690]  mx-auto flex flex-col mt-2  p-4  ">
                            <div className="space-y-8">
                                <h2 className="text-white font-bold text-2xl text-center font-nexa ">
                                    Create New Proposal
                                </h2>
                                <div className="flex flex-row gap-4 justify-center text-lg items-center  ">
                                    <textarea
                                        value={proposal}
                                        onChange={(e: any) => setProposal(e.target.value)}
                                        name=""
                                        id=""
                                        cols={60}
                                        rows={3}
                                        maxLength={100}
                                        placeholder="Create your proposal for the event you registered for"
                                        className="text-start p-2 bg-[#EEE1FF] text-black"
                                    ></textarea>
                                </div>

                                <div className="flex  justify-between gap-8 mx-4">
                                    <button onClick={handleClose} className="text-lg font-semibold justify-center p-4 text-black bg-white w-full flex hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]">
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="text-lg font-semibold text-center justify-center p-4  w-full  flex bg-gradient-to-r from-[#5522CC] to-[#8352f5]  text-white hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF] "
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/*  */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default NewProposalModal;
