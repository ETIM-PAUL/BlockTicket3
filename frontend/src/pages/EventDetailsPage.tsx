import React from "react";
import EventDetails from "../components/EventDetails";
import Footer from "../components/Footer";

type Props = {};

const EventDetailsPage = (props: Props) => {
    return (
        <div className="bg-white flex flex-col justify-between">
            <EventDetails />

            <Footer />
        </div>
    );
};

export default EventDetailsPage;
