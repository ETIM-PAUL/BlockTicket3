import React from "react";
import { Link } from "react-router-dom";

type Props = {};

const Logo = (props: Props) => {
    return (
        <div className="">
            <Link
                to="/"
                className=""
            >
              <div className="text-4xl font-semibold">
              <h2 className="   whitespace-nowrap dark:text-white">
                    Block<span className=" font-semibold">Ticket3</span>
                </h2>
              </div>


               
            </Link>
        </div>
    );
};

export default Logo;
