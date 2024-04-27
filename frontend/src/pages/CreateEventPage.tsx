import React from "react";
import CreateEvent from "../components/CreateEvent";
import Footer from "../components/Footer";

type Props = {};

const CreateEventPage = (props: Props) => {
    return (
        <div className="bg-[#1E1E1E]">
            <CreateEvent />

            <Footer />
        </div>
    );
};

export default CreateEventPage;
