import React, { useState } from "react";
import TicketPurchaseModal from "./TicketPurchaseModal";

type Props = {
    isVisible: boolean;
    onClose: boolean | void | string | any;
};

const BuyTicketModal = ({ isVisible, onClose }: Props) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showTicketModal, setShowTicketModal] = useState<boolean>(false);
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
                <div className="w-[800px]  bg-black flex flex-col relative ">
                    <div className=" p-2 rounded">
                        <button
                            className="text-white text-2xl absolute top-6 right-10   "
                            onClick={() => onClose()}
                        >
                            X
                        </button>

                        <div className="bg-black  mx-auto flex flex-col mt-2  p-4  ">
                            <h2 className="text-white font-bold text-2xl text-center font-nexa">
                                Choose Ticket Type
                            </h2>

                            <div className="flex flex-row mt-10 justify-between gap-4 py-6 ">
                                {/* Regular */}
                                <div className=" space-y-2 pt-2 text-center justify-center  flex flex-col w-full border border-[#292929]">
                                    <p className="text-2xl">Regular</p>

                                    <p>13ETH</p>
                                    <button
                                        className="  text-lg font-semibold justify-center p-4 text-black bg-white w-full flex hover:bg-[#292929] hover:text-white"
                                        onClick={() => setShowTicketModal(true)}
                                    >
                                        Buy
                                    </button>
                                </div>

                                {/* VIP */}
                                <div className=" space-y-2  pt-2   text-center justify-center  flex flex-col w-full border border-[#292929]">
                                    <p className="text-2xl">VIP</p>

                                    <p>20ETH</p>
                                    <button
                                        className="text-lg font-semibold justify-center p-4 text-black bg-white w-full flex hover:bg-[#292929] hover:text-white"
                                        onClick={() => setShowTicketModal(true)}
                                    >
                                        Buy
                                    </button>
                                </div>

                                {/* V-VIP */}
                                <div className=" space-y-2   pt-2  text-center justify-center  flex flex-col w-full border border-[#292929]">
                                    <p className="text-2xl">V-VIP</p>

                                    <p>13ETH</p>
                                    <button
                                        className="text-lg font-semibold justify-center p-4 text-black bg-white w-full flex hover:bg-[#292929] hover:text-white"
                                        onClick={() => setShowTicketModal(true)}
                                    >
                                        Buy
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/*  */}

                        <TicketPurchaseModal
                            isVisible={showTicketModal}
                            onClose={() => setShowTicketModal(false)}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default BuyTicketModal;
