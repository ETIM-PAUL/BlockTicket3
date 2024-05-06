import React from "react";

import NewProposalForm from "../NewProposalForm";

type Props = {
    isVisible: boolean;
    onClose: boolean | void | string | any;
};

const NewProposalModal = ({ isVisible, onClose }: Props) => {
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
                <div className="w-[800px]  bg-gradient-to-l from-[#5522CC] to-[#ED4690] flex flex-col relative ">
                    <div className=" p-14 rounded">
                        <button
                            className="text-white text-2xl absolute top-6 right-10   "
                            onClick={() => onClose()}
                        >
                            X
                        </button>

                        <div className="bg-gradient-to-r from-[#5522CC] to-[#ED4690]  mx-auto flex flex-col mt-2  p-4  ">
                            <NewProposalForm />
                        </div>
                        {/*  */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default NewProposalModal;
