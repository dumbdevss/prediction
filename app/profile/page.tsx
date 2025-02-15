"use client";
import { useState } from "react";
import {
  useWallet
} from "@razorlabs/razorkit";
import { Copy, Trash2, Check, Twitter, MessageCircle, Send } from "lucide-react"
import { PiGithubLogo, PiXLogo, PiDiscordLogo, PiTelegramLogo } from "react-icons/pi";
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Particles from "@/components/ui/particles";
import Header from "@/components/header";

export default function Profile() {

  const [copied, setCopied] = useState<string | null>(null);
  const wallet = useWallet();

  console.log(wallet);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(text)
    setTimeout(() => setCopied(null), 2000)
  }



  const formatAddress = (address: any) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <main className="flex min-h-screen flex-col items-center overflow-x-clip pt-12 md:pt-24">
      <section className="flex flex-col items-center px-4 sm:px-6 lg:px-8">
        <Header />
      </section>

      <div className="min-h-screen text-white w-full">
        <div className="container max-w-[1000px] mx-auto grid grid-cols-[250px,1fr] justify-between w-full p-6">
          {/* Sidebar */}
          <aside className="space-y-6">
            <nav className="space-y-2">
              <Button variant="ghost" className="w-max justify-start">
                Wallet Address
              </Button>
              <Button variant="ghost" className="w-max justify-start">
                Social Account
              </Button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="space-y-8">
            {/* Wallet Addresses */}
            <section>
              <h2 className="mb-4 text-2xl font-bold">Address List</h2>
              <Card className="space-y-4 bg-zinc-900 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img className="w-4 h-4" src="/movement-logo.png" />
                    <span>Movement</span>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-zinc-800 p-3">
                  <span className="font-mono">{formatAddress(wallet.account?.address)}</span>
                  <div className="flex gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => handleCopy("0x4319...7ca7")}>
                            {copied === "0x4319...7ca7" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{copied === "0x4319...7ca7" ? "Copied!" : "Copy address"}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </Card>
            </section>

            {/* Social Accounts */}
            <section>
              <h2 className="mb-4 text-2xl font-bold">Social Accounts</h2>
              <Card className="space-y-6 bg-zinc-900 p-4">
                {/* Twitter */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>X</span>
                    <div className="space-x-2">
                      <Button variant="link" className="text-blue-500">
                        Remove
                      </Button>
                      <Button variant="link" className="text-blue-500">
                        Change
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-zinc-800 p-3">
                    <div className="flex items-center gap-2">
                      <PiXLogo className="h-5 w-5" />
                      <span>DumbDevs</span>
                    </div>
                  </div>

                </div>

                {/* Discord */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Discord</span>
                    <div className="space-x-2">
                      <Button variant="link" className="text-blue-500">
                        Remove
                      </Button>
                      <Button variant="link" className="text-blue-500">
                        Change
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-zinc-800 p-3">
                    <div className="flex items-center gap-2">
                      <PiDiscordLogo className="h-5 w-5" />
                      <span>dumbdevs.apt#0</span>
                    </div>
                  </div>

                </div>

                {/* Telegram */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Telegram</span>
                    <div className="space-x-2">
                      <Button variant="link" className="text-blue-500">
                        Remove
                      </Button>
                      <Button variant="link" className="text-blue-500">
                        Change
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-zinc-800 p-3">
                    <div className="flex items-center gap-2">
                      <PiTelegramLogo className="h-5 w-5" />
                      <span>TayworT</span>
                    </div>
                  </div>
                </div>

                {/* Github */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Github</span>
                    <div className="space-x-2">
                      <Button variant="link" className="text-blue-500">
                        Remove
                      </Button>
                      <Button variant="link" className="text-blue-500">
                        Change
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-zinc-800 p-3">
                    <div className="flex items-center gap-2">
                      <PiGithubLogo className="h-5 w-5" />
                      <span>Titre123</span>
                    </div>
                  </div>
                </div>
              </Card>
            </section>
          </main>
        </div>
      </div>

      <Particles
        quantityDesktop={350}
        quantityMobile={100}
        ease={80}
        color={"#F7FF9B"}
        refresh
      />
    </main>
  );
}