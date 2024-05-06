import React from 'react'
import { Link } from 'react-router-dom'
import Logo from "./Logo";
import WalletConnect from "./WalletConnect";
import { useConnectWallet } from '@web3-onboard/react';

const TopNav = () => {
  const [{ wallet }] = useConnectWallet();

  return (
    <div className="navbar flex bg-gradient-to-r from-[#5522CC] to-[#ED4690] py-8 px-6">
      <div className="flex-1 ml-16 ">
        <Logo />
      </div>

      <div className="flex mr-14 gap-10">
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
        <WalletConnect />
      </div>
    </div>
  )
}

export default TopNav