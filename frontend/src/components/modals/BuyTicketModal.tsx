import React, { useState } from "react";
import TicketPurchaseModal from "./TicketPurchaseModal";

type Props = {
    isVisible: boolean;
    onClose: boolean | void | string | any;
};

const BuyTicketModal = ({ isVisible, onClose }: Props) => {
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
                <div className="w-[800px]  bg-gradient-to-l from-[#5522CC] to-[#ED4690] flex flex-col relative ">
                    <div className=" p-8 rounded">
                        <button
                            className="text-black bg-white text-2xl b-white border rounded-[50%] w-8 h-8 absolute top-6 right-10   "
                            onClick={() => onClose()}
                        >
                            X
                        </button>

                        <div className="bg-gradient-to-r from-[#5522CC] to-[#ED4690]  mx-auto flex flex-col mt-10  px-4 py-6 ">
                            <h2 className="text-white font-bold text-2xl text-center font-nexa">
                                Choose Ticket Type
                            </h2>

                            <div className="flex flex-row mt-1 justify-between gap-4 py-6 text-white">
                                {/* Regular */}
                                <div className=" space-y-2 pt-2 text-center justify-center  flex flex-col w-full border shadow-2xl">
                                    <p className="text-2xl">Regular</p>

                                    <p>13ETH</p>
                                    <button
                                        className="  shadow-2xl text-lg font-semibold justify-center p-2 text-white  bg-gradient-to-l from-[#5522CC] to-[#ED4690]    hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]"
                                        onClick={() => setShowTicketModal(true)}
                                    >
                                        Buy
                                    </button>
                                </div>

                                {/* VIP */}
                                <div className=" space-y-2  pt-2   text-center justify-center  flex flex-col w-full border shadow-2xl">
                                    <p className="text-2xl">VIP</p>

                                    <p>20ETH</p>
                                    <button
                                        className="text-lg font-semibold justify-center p-2 text-white  bg-gradient-to-r from-[#5522CC] to-[#8352f5]   hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]"
                                        onClick={() => setShowTicketModal(true)}
                                    >
                                        Buy
                                    </button>
                                </div>

                                {/* V-VIP */}
                                <div className=" space-y-2   pt-2  text-center justify-center  flex flex-col w-full border shadow-2xl">
                                    <p className="text-2xl">V-VIP</p>

                                    <p>13ETH</p>
                                    <button
                                        className="text-lg font-semibold justify-center p-2   bg-gradient-to-r from-[#5522CC] to-[#8352f5]  text-white hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]"
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
