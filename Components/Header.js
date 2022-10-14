import React from 'react'
import {ConnectButton} from "web3uikit"

function Header() {
  return (
    <div className='flex items-center justify-between my-3 py-2 border-b-2 font-bold'>
     <h2 className="text-2xl">Decentralize Raffle</h2>
       <ConnectButton moralisAuth={false} className="shadow-2xl"/>
    </div>
  )
}

export default Header