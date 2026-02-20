'use client'

import { Wallet, LogOut } from 'lucide-react'
import { useAccount, useConnect, useDisconnect, useConnectors } from 'wagmi'

export default function WalletButton() {

  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const connectors = useConnectors()
  const { disconnect } = useDisconnect()

  if (isConnected) {

    return (

      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">

        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />

        <span className="hidden sm:block text-xs font-bold font-mono text-slate-600">

          {address?.slice(0, 6)}...
          {address?.slice(-4)}

        </span>

        <button
          onClick={() => disconnect()}
          className="ml-1 p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50"
        >
          <LogOut size={14} />
        </button>

      </div>

    )
  }

  return (

    <>
      {connectors.map(connector => (

        <button
          key={connector.uid}
          onClick={() => connect({ connector })}
          className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2 rounded-xl font-bold"
        >

          <Wallet size={15} />

          Connect Wallet

        </button>

      ))}
    </>

  )
}
