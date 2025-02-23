"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getRandomGradient } from "@/utils/gradients"
import { MarketCardSkeleton } from "@/components/market_skeleton"
import aptos from "@/lib/aptos"

interface Market {
  id: number
  question: string
  creator: string
  creator_username: string
  is_resolved: boolean
  outcome: string | null
  yes_predictions: number
  no_predictions: number
  gradient: string
}

type FunctionString = `${string}::${string}::${string}`

interface InputViewFunctionData {
  function: FunctionString
  functionArguments: any[]
}

const dummyMarkets: Market[] = [
  {
    id: 1,
    question: "Bitcoin price above $50,000 by end of 2023",
    creator: "User123",
    creator_username: "crypto_guru",
    is_resolved: false,
    outcome: null,
    yes_predictions: 120,
    no_predictions: 80,
    gradient: getRandomGradient(),
  },
  {
    id: 2,
    question: "SpaceX Starship reaches orbit in 2023",
    creator: "User456",
    creator_username: "space_fanatic",
    is_resolved: false,
    outcome: null,
    yes_predictions: 200,
    no_predictions: 50,
    gradient: getRandomGradient(),
  },
]

export default function Markets() {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [markets, setMarkets] = useState<Market[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchMarkets = async () => {
      setIsLoading(true)
      console.log(process.env.NEXT_PUBLIC_MODULE_ADDRESS)
      const viewPayload: InputViewFunctionData = {
        function: `${process.env.NEXT_PUBLIC_MODULE_ADDRESS}::PredictionMarkets::get_all_markets`,
        functionArguments: [],
      }

      try {
        const result: [Market[]] = await aptos.view({ payload: viewPayload })
        console.log(result)
        const real_result: Market[] = result?.[0]
        const formattedMarkets: Market[] = real_result.map((market) => ({
          id: market.id,
          question: market?.question,
          creator: market?.creator,
          creator_username: market?.creator_username,
          is_resolved: market?.is_resolved,
          outcome: market?.outcome,
          yes_predictions: market?.yes_predictions,
          no_predictions: market?.no_predictions,
          gradient: getRandomGradient(),
        }))
        setMarkets(formattedMarkets || dummyMarkets)
      } catch (error) {
        console.error("Error viewing markets:", error)
        setMarkets(dummyMarkets)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMarkets()
  }, [])

  function formatSentence(sentence: string) {
    return sentence.toLowerCase().replace(/\s+/g, "_")
  }

  const filteredMarkets = markets.filter((market) =>
    market?.question?.toLowerCase().includes(searchTerm?.toLowerCase()),
  )

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-4 flex justify-center w-full">
        <Input
          type="text"
          placeholder="Search markets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-[400px]"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading
          ? // Render skeleton cards while loading
            Array.from({ length: 6 }).map((_, index) => <MarketCardSkeleton key={index} />)
          : // Render actual market cards when data is loaded
            filteredMarkets.map((market) => (
              <Card key={market?.id}>
                <div style={{ background: market?.gradient }} className={`h-32 border`}></div>
                <CardHeader>
                  <CardTitle className="truncate">{market?.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Creator: {market?.creator_username}</p>
                  <p className="text-sm text-gray-500">Resolved: {market?.is_resolved ? "Yes" : "No"}</p>
                  <p className="text-sm text-gray-500">Outcome: {market?.outcome || "Pending"}</p>
                  <Link href={`/market/${formatSentence(market?.question)}`} prefetch={false}>
                    <Button className="mt-3 w-full">View Market</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  )
}

