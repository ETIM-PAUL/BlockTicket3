import React from "react";

import { Link } from "react-router-dom";
import { blockTicket3Logo } from "../assets";


const Home = () => {
    return (
        <>
            <section className="flex md:flex-row flex-col sm:py-16  sm-px-16 px-6  justify-between mt-2 mx-20">

            <div className="flex flex-col w-full md:w-1/2">
            <h1 className="font-roboto font-medium sm:text-[40px] text-[42px] text-[#080E26] sm:leading-[75px] leading-[55px] w-full text-center">
                       <span className="" >Seamlessly</span>  Create and Manage Your <span className="" >Event Tickets</span>  On-Chain
                    </h1>
          <p className="text-dimBlack font-redRose text-2xl mt-6 text-black">
            We provide you access to unique and seamless onChain Event Creation, Ticketing, Management and DAO proposal, allowing user to make proposal by Upvoting or downvoting the events that they have registered based on the quality and their satisfaction.
           
          </p>


          <div className="flex mt-8 gap-4 w-full mx-auto font-medium text-lg ">
                        <div className="bg-[#082621]  text-white flex  items-center justify-center rounded-lg w-full h-12 p-4 shadow-lg cursor-pointer hover:bg-white hover:text-black">
                            <Link to="/create-ticket">Create Event</Link>
                        </div>
                        <div className="bg-[#FFFFFF] hover:bg-[#212529] border hover:border-none border-gray-200 text-black flex items-center justify-center rounded-lg w-full h-12 p-4 shadow-lg cursor-pointer hover:text-[#FFFFFF]">
                            <Link to="/events">Buy Ticket</Link>
                        </div>
                    </div>
         
</div>


                <div className="">
                  
                  <img src={blockTicket3Logo} alt="heroImage" width={450} 
                  className="rounded-lg" />
                   
                </div>
            </section>
        </>
    );
};

export default Home;
