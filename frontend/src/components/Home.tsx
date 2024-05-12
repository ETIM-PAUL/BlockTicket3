import React from "react";

import { event7 } from "../assets";

import HeroNav from "./HeroNav";
import UpcomingEvents from "./UpcomingEvents";

const Home = () => {
    return (
        <>
            <HeroNav />

            <UpcomingEvents />

            <div className="bg-[#EEE1FF] py-6 pb-20">
                <div className="flex flex-row items-center justify-center mx-auto gap-20">
                    <img src={event7} alt="createEvent" />

                    <div className="flex flex-col">
                        <h2 className=" text-black font-medium text-2xl">
                            Create your own Event{" "}
                        </h2>
                        <p className="mt-4 text-black text-lg">
                            Create your own event and Manage your ticketing
                            seamlessy on-chain
                        </p>

                        <div className=" justify-center">
                            <a href="/create-event">
                                <button className="bg-[#F5167E] rounded-md text-center justify-center items-center mt-6 p-2 text-white text-xl hover:bg-[#5522CC] w-1/2">
                                    {" "}
                                    Create Event
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
