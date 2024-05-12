import React from 'react'
import { Link } from 'react-router-dom'
import Logo from "./Logo";
import WalletConnect from "./WalletConnect";
import { useConnectWallet } from '@web3-onboard/react';

const TopNav = () => {
  const [{ wallet }] = useConnectWallet();

  return (
    <div className="navbar flex bg-gradient-to-r from-[#5522CC] to-[#ED4690] py-3 md:py-8 px-6 md:px-20">
      <div className="flex-1 ">
        <Logo />
      </div>

      <div className='hidden md:flex'>
        <div className="flex gap-3">
          {wallet &&
            <Link
              to="/user-dashboard"
              className="font-medium rounded-md text-xl px-4 py-3 text-center bg-white text-black"
            >
              Dashboard
            </Link>
          }
          {wallet &&
            <Link
              to="/my-wallet"
              className="font-medium rounded-md text-xl px-4 py-3 text-center bg-white text-black"
            >
              My Wallet
            </Link>
          }
        </div>
        <WalletConnect />
      </div>

      {/* mobile nav */}
      <div className='block md:hidden'>
        <span>Mobile</span>
      </div>
    </div>
  )
}

export default TopNav