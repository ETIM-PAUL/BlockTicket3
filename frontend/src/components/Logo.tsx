import React from "react";
import { Link } from "react-router-dom";

type Props = {};

const Logo = (props: Props) => {
    return (
        <div className="ml-10">
            <Link
                to="/"
                className="flex items-center space-x-3 rtl:space-x-reverse"
            >
                <span className="  self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                    BlockTicket3
                </span>
            </Link>
        </div>
    );
};

export default Logo;
