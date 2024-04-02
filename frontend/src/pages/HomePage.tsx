import React from "react";

import { Link } from "react-router-dom";

const HomePage = () => {
    return (
        <>
            <section className="flex md:flex-row flex-col sm:py-16 py-6 sm-px-16 px-6 gap-16 bg-white mt-4 ">
                <div className="flex flex-1 items-start justify-center flex-col xl:px-0 sm:px-16 px-6">
                    <h1 className="font-roboto font-semibold sm:text-[40px] text-[42px] text-[#080E26] sm:leading-[75px] leading-[55px] w-full text-center">
                        Seamlessly Create and Manage Your Event Tickets
                    </h1>
                    <p className="font-poppins font-normal text-[#666666] text-xl leading-[30.8px]  mt-5 text-center">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Distinctio, necessitatibus minus dolores accusantium
                        maiores iste soluta provident quos beatae sit dolore
                        minima dignissimos nobis itaque culpa, libero, suscipit
                        nemo sunt? Lorem ipsum dolor sit amet consectetur
                        adipisicing elit. Velit nesciunt animi alias distinctio
                        itaque quisquam? Amet repellat cum, a pariatur id dolore
                        fugit similique eius minima vitae officiis alias
                        consequatur. Lorem ipsum dolor sit amet consectetur,
                        adipisicing elit. Dolorum necessitatibus vel repudiandae
                        cupiditate, laudantium omnis nobis ab error modi libero
                        distinctio nam atque inventore voluptate unde eos? Sint,
                        unde necessitatibus?
                    </p>
                    <div className="flex mt-8 gap-4 justify-center items-center mx-auto ">
                        <div className="bg-[#082621] text-white flex  items-center justify-center rounded-lg w-36 h-12 p-4 shadow-lg cursor-pointer">
                            <Link to="/create-ticket">Create Ticket</Link>
                        </div>
                        <div className="bg-[#FFFFFF] hover:bg-[#212529] border hover:border-none border-[#080E26] text-[#080E26] flex items-center justify-center rounded-lg w-36 h-12 p-4 shadow-lg cursor-pointer hover:text-[#FFFFFF]">
                            <Link to="/events">Buy Ticket</Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default HomePage;
