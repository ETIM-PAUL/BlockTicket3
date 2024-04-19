import React, { useState } from "react";

import NewProposalForm from "../NewProposalForm";
import Participants from "../Participants";

type Props = {
    isVisible: boolean;
    onClose: boolean | void | string | any;
};

const ParticipantModal = ({ isVisible, onClose }: Props) => {
    if (!isVisible) return null;

    const handleClose = (e: any) => {
        if (e.target.id === "wrapper") onClose();
    };

    return (
        <>
            <div className="fixed inset-0 z-10 items-center justify-center bg-[#292929] bg-opacity-75"></div>

            <div
                className="fixed inset-0 flex justify-center items-center z-50"
                id="wrapper"
                onClick={handleClose}
            >
                <div className="w-[1000px]  bg-[#1E1E1E] flex flex-col relative ">
                    <div className=" px-2 py-6 rounded">
                        <button
                            className="text-white text-2xl absolute top-6 right-10   "
                            onClick={() => onClose()}
                        >
                            X
                        </button>

                        <div className="bg-[#1E1E1E]  mx-auto flex flex-col mt-2  p-4  ">
                            <Participants />
                        </div>
                        {/*  */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ParticipantModal;
