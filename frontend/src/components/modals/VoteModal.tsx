import React, { useState } from "react";

type Props = {
    isVisible: boolean;
    onClose: boolean | void | string | any;
};

const VoteModal = ({ isVisible, onClose }: Props) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    if (!isVisible) return null;

    const handleClose = (e: any) => {
        if (e.target.id === "wrapper") onClose();
    };

    return (
        <div>
            <div className="fixed inset-0 z-10 items-center justify-center bg-[#292929] bg-opacity-25"></div>
            <div
                className="fixed inset-0 flex justify-center items-center z-50"
                id="wrapper"
                onClick={handleClose}
            >
                <div className="w-[500px]  bg-black backdrop-blur-none z-50 flex flex-col relative ">
                    <div className=" p-2 rounded">
                        <button
                            className="text-white text-2xl absolute top-6 right-10   "
                            onClick={() => onClose()}
                        >
                            X
                        </button>

                        <div className="bg-black   z-50  mx-auto flex flex-col mt-2  p-4  ">
                            <h2 className="text-white font-bold text-2xl text-center font-nexa">
                                Give Your Vote
                            </h2>

                            <div className="flex flex-row mt-10 justify-between gap-4 py-6 ">
                                {/* Up Vote */}
                                <div className="flex w-full">
                                    <button
                                        className="text-lg font-semibold justify-center p-4 text-black bg-white w-full flex hover:bg-[#292929] hover:text-white"
                                        onClick={() => setShowModal(true)}
                                    >
                                        Up Vote
                                    </button>
                                </div>

                                {/* Down Vote*/}
                                <div className="flex w-full">
                                    <button className="text-lg font-semibold text-center justify-center p-4 bg-[#292929] text-white w-full  flex hover:bg-white hover:text-black ">
                                        Down Vote
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/*  */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VoteModal;
