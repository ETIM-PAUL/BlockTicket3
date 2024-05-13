import { cartesi } from "../assets";

const Footer = () => {
    return (
        <div className="w-[100%] rounded- flex  justify-between items-center md:flex-row flex-col px-20 py-[26.5px] bg-[#5522CC]">
            <p className="font-poppins font-normal text-lg text-center text-[#FFFFFF] leading-[27px] ml-1 ">
                Copyright Ⓒ 2024 BlockTicket3. All Rights Reserved
            </p>

            <div className="hidden md:flex space-x-6 items-center mr-4 ">
                <a
                    href="https://cartesi.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img src={cartesi} alt="Cartesi Logo" width={50} />
                </a>
                <p className="text-xl text-white">
                    Powered by
                    <span>
                        {" "}
                        <a
                            href="https://cartesi.io/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Cartesi Machine
                        </a>
                    </span>
                </p>
            </div>

            {/* Mobile View */}

            <p className=" md:hidden flex font-poppins font-normal text-lg text-center text-[#FFFFFF] leading-[27px] ">
                Copyright Ⓒ 2024 BlockTicket3. <br /> All Rights Reserved
            </p>

            <div className="md:hidden flex  space-x-4 items-center mr-4 mt-4  justify-center  mx-auto">
                <a
                    href="https://cartesi.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img src={cartesi} alt="Cartesi Logo" width={50} />
                </a>
                <p className="text-xl text-white">
                    Powered by
                    <span>
                        {" "}
                        <a
                            href="https://cartesi.io/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Cartesi Machine
                        </a>
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Footer;
