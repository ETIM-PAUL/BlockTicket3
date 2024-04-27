import React from "react";
import EventDetails from "../components/EventDetails";
import Footer from "../components/Footer";

type Props = {};

const EventDetailsPage = (props: Props) => {
    return (
        <div className="bg-white">
            <EventDetails />

            <Footer />
        </div>
    );
};

export default EventDetailsPage;
