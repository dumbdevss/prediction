'use client'

import { WalletProvider } from "@razorlabs/razorkit";

export default function RootLayoutClient({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <WalletProvider>
      {children}
    </WalletProvider>
  )
}