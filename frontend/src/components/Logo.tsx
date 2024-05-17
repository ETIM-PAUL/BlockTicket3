import React from "react";
import { Link } from "react-router-dom";

type Props = {};

const Logo = (props: Props) => {
    return (
        <div className="text-start block w-full">
            <Link
                to="/"
                className=""
            >
                <div className="text-2xl md:text-4xl font-semibold">
                    <h2 className="whitespace-nowrap dark:text-white">
                        Block<span className="font-serif font-bold">Ticket3</span>
                    </h2>
                </div>



            </Link>
        </div>
    );
};

export default Logo;
