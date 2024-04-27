import React from "react";
import UserDashboard from "../components/UserDashboard";
import Footer from "../components/Footer";

type Props = {};

const UserDashboardPage = (props: Props) => {
    return (
        <div>
            <div className="">
                <UserDashboard />
            </div>

            <Footer />
        </div>
    );
};

export default UserDashboardPage;
