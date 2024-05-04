import React from "react";
import AllEvents from "../components/AllEvents";
import Footer from "../components/Footer";

type Props = {};

const AllEventsPage = (props: Props) => {
    return (
        <div className="bg-white">
            <AllEvents />

            <Footer />
        </div>
    );
};

export default AllEventsPage;
