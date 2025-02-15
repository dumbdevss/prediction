import React, { useEffect, useState } from 'react';
import {
  ConnectModal,
  useWallet,
  useAccountBalance,
  formatCurrency,
} from "@razorlabs/razorkit";
import '@razorlabs/razorkit/style.css';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const WalletButton = () => {
  const { balance } = useAccountBalance();
  const wallet = useWallet();
  const {connected} = useWallet();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (connected) {
      setShowModal(false); // Close modal when connected
    }
  }, [connected]);


  const formatAddress = (address: any) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleDisconnect = async () => {
    try {
      await wallet.disconnect();
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  return (
    <div className="relative">
      <ConnectModal
        open={showModal}
        onOpenChange={setShowModal}
      >
        {wallet.connected ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 border border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800 transition-all"
              >
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span>{formatAddress(wallet.account?.address)}</span>
                  <div className="h-4 w-px bg-zinc-700" />
                  <span className="text-sm">
                    {formatCurrency(balance ?? 0, {
                      withAbbr: true,
                      decimals: 8,
                    })} MOVE
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem 
                className="text-red-500 cursor-pointer focus:text-red-500"
                onClick={handleDisconnect}
              >
                Disconnect Wallet
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="default"
            onClick={() => setShowModal(true)}
            className="bg-zinc-900 text-zinc-100 hover:bg-zinc-800 transition-all border border-zinc-700"
          >
            Connect Wallet
          </Button>
        )}
      </ConnectModal>
    </div>
  );
};

const WalletConnect = () => {

  return(
    <WalletButton />
  );
};

export default WalletConnect;