import { Link } from "react-router-dom";
import { footerLinks, socialMedia } from "../constants";

import { blockTicket3Logo } from "../assets";

const Footer = () => {
    return (
        // <section className="flex justify-center items-cente flex-col  bg-[#FFFFFF]">

        <div className="w-[100%] rounded- flex  justify-between items-center md:flex-row flex-col px-20 py-10 bg-[#080E26] ">
            <p className="font-poppins font-normal text-lg text-center text-[#FFFFFF] leading-[27px] -ml-6">
                Copyright Ⓒ 2024 BlockTicket3. All Rights Reserved.
            </p>

            <div className="flex flex-row md:mt-0 mt-6">
                {socialMedia.map((media, index) => (
                    <img
                        key={media.id}
                        src={media.icon}
                        alt={media.id}
                        width={24}
                        height={24}
                        className={`object-contain cursor-pointer 
                  ${index !== socialMedia.length - 1 ? "mr-6" : "mr-0"}`}
                        onClick={() => window.open(media.link)}
                    />
                ))}
            </div>
        </div>
        // </section>
    );
};

export default Footer;
