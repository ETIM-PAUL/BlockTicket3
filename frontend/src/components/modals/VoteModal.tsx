import React from "react";

type Props = {
    isVisible: boolean;
    onClose: boolean | void | string | any;
};

const VoteModal = ({ isVisible, onClose }: Props) => {
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
                <div className="w-[550px]    bg-gradient-to-l from-[#5522CC] to-[#ED4690] backdrop-blur-none z-50 flex flex-col relative ">
                    <div className=" p-10 rounded">
                        <button
                            className="text-white text-2xl absolute top-4 right-8   "
                            onClick={() => onClose()}
                        >
                            X
                        </button>

                        <div className="  bg-gradient-to-r from-[#5522CC] to-[#ED4690]   z-50  mx-auto flex flex-col mt-2  p-4  ">
                            <h2 className="text-white font-bold text-xl text-center font-nexa pt-4">
                                Give Your Vote
                            </h2>
                            <p className="text-center mt-4">
                                You Vote counts we want to hear from you on the
                                quality of the event.
                            </p>

                            <div className="flex flex-row mt-10 justify-between gap-4 py-6 ">
                                {/* Up Vote */}
                                <div className="flex w-full">
                                    <button
                                        className="text-lg font-semibold justify-center p-4 text-black  w-full flex bg-white  hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]"
                                    >
                                        Up Vote
                                    </button>
                                </div>

                                {/* Down Vote*/}
                                <div className="flex w-full">
                                    <button className="text-lg font-semibold text-center justify-center p-4 bg-gradient-to-r from-[#5522CC] to-[#8352f5]  text-white hover:bg-gradient-to-r hover:from-[#9a8abd] hover:to-[#5946ed] hover:text-[#FFFFFF]">
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
