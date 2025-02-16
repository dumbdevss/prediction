"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useWallet } from "@razorlabs/razorkit"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/components/header"
import { CustomProgress } from "@/components/ui/custom-progress"
import { MarketDetailSkeleton } from "@/components/market-detail-skeleton"
import { ArrowRight, CheckCircle, XCircle } from "lucide-react"
import decodeUrlString from "@/utils/special"
import aptos from "@/lib/aptos"

interface Market {
  id: string
  question: string
  creator: string
  creator_username: string
  is_resolved: boolean
  outcome: boolean | null
}

type Functionstring = `${string}::${string}::${string}`

interface InputViewFunctionData {
  function: Functionstring
  functionArguments: any[]
}

interface InputEntryFunctionData {
  function: Functionstring
  functionArguments: any[]
}

// New type definitions for the view function results
type MarketResult = [string, string, string, string, string, string]
type PredictionCountsResult = [string, string]
type PredictionOddsResult = [string, string]

export default function MarketDetail(): React.ReactElement {
  const params = useParams()
  const { signAndSubmitTransaction } = useWallet();
  const marketId: string = params.id as string
  const [market, setMarket] = useState<Market | null>(null)
  const [prediction, setPrediction] = useState<"yes" | "no" | null>(null)
  const [amount, setAmount] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [predictionCounts, setPredictionCounts] = useState<[string, string]>(['0', '0'])
  const [predictionOdds, setPredictionOdds] = useState<[string, string]>(['0', '0'])

  useEffect(() => {
    const fetchMarketData = async (): Promise<void> => {
      setIsLoading(true)
      console.log(decodeUrlString(marketId))
      const viewPayload: InputViewFunctionData = {
        function: `${process.env.NEXT_PUBLIC_MODULE_ADDRESS}::PredictionMarkets::get_market_by_question`,
        functionArguments: [decodeUrlString(marketId)],
      }

      const predictionView: InputViewFunctionData = {
        function: `${process.env.NEXT_PUBLIC_MODULE_ADDRESS}::PredictionMarkets::get_prediction_counts`,
        functionArguments: [decodeUrlString(marketId)],
      }

      const predictionOddsView: InputViewFunctionData = {
        function: `${process.env.NEXT_PUBLIC_MODULE_ADDRESS}::PredictionMarkets::get_prediction_odds`,
        functionArguments: [decodeUrlString(marketId)],
      }

      try {
        const [marketResult, countsResult, oddsResult] = await Promise.all([
          aptos.view<MarketResult>({ payload: viewPayload }),
          aptos.view<PredictionCountsResult>({ payload: predictionView }),
          aptos.view<PredictionOddsResult>({ payload: predictionOddsView })
        ])

        const [id, question, creator, creator_username, is_resolved, outcome] = marketResult
        const marketData: Market = {
          id,
          question,
          creator,
          creator_username,
          is_resolved: is_resolved === "true",
          outcome: outcome === "true" ? true : outcome === "false" ? false : null,
        }

        console.log(marketData)
        setMarket(marketData)
        setPredictionCounts(countsResult as [string, string])
        setPredictionOdds(oddsResult as [string, string])
      } catch (error) {
        console.error("Error fetching market data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMarketData()
  }, [marketId])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (prediction === null) {
      alert("Please select a prediction");
      return;
    }

    const transactionPayload: InputEntryFunctionData = {
      function: `${process.env.NEXT_PUBLIC_MODULE_ADDRESS}::PredictionMarkets::make_prediction`,
      functionArguments: [marketId, prediction === "yes"],
    };

    try {
      const response: any = await signAndSubmitTransaction({ 
        payload: transactionPayload 
      });
      
      console.log(`Transaction submitted: https://explorer.movementlabs.xyz/txn/${response.hash}?network=bardock_testnet`);
      
      // Optional: Add a success message
      alert("Prediction submitted successfully!")
      
    } catch (error) {
      console.error("Error submitting transaction:", error);
      
      // Show a user-friendly error message
      if (error instanceof Error) {
        alert(`Failed to submit prediction: ${error.message}`);
      } else {
        alert("Failed to submit prediction. Please try again.");
      }
      
    } finally {      
      // Reset form
      setPrediction(null);
      setAmount("");
    }
  }

  if (isLoading) {
    return <MarketDetailSkeleton />
  }

  if (!market) {
    return <div className="flex justify-center items-center h-screen">Market not found</div>
  }

  const totalPredictions = parseInt(predictionCounts[0] as string) + parseInt(predictionCounts[1] as string);
  const yesPercentage = (parseInt(predictionCounts[0] as string) / totalPredictions) * 100 || 0;



  return (
    <main className="flex min-h-screen flex-col items-center overflow-x-clip pt-12 md:pt-24">
      <section className="flex flex-col items-center px-4 sm:px-6 lg:px-8">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg p-6 mb-8">
            <h1 className="text-3xl font-bold text-center truncate text-white mb-2">
              {market.question}
            </h1>
            <p className="text-center text-gray-200">Created by: {market.creator_username}</p>
          </div>
          <Card className="overflow-hidden shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <CardTitle className="text-2xl">Market Details</CardTitle>
              <CardDescription className="text-gray-100">Predict the outcome</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <CustomProgress yesPercentage={yesPercentage} yesCount={parseInt(predictionCounts[0])} noCount={parseInt(predictionCounts[1])} />
              <div className="grid grid-cols-2 gap-6 my-6">
                <div className="bg-green-100 p-4 rounded-lg text-center">
                  <p className="font-semibold text-lg mb-2 text-green-800">Yes</p>
                  <p className="text-2xl font-bold text-green-600">{predictionOdds[0]}%</p>
                  <p className="text-green-700">{predictionCounts[0]} predictions</p>
                </div>
                <div className="bg-red-100 p-4 rounded-lg text-center">
                  <p className="font-semibold text-lg mb-2 text-red-800">No</p>
                  <p className="text-2xl font-bold text-red-600">{predictionOdds[1]}%</p>
                  <p className="text-red-700">{predictionCounts[1]} predictions</p>
                </div>
              </div>
              <p className="text-center mb-4 text-white">Total Predictions: {totalPredictions}</p>
              <div className="bg-gray-100 p-4 rounded-lg mb-6">
                <p className="mb-2 text-gray-800">
                  <span className="font-semibold">Market Question:</span> {market.question}
                </p>
                <p className="mb-2 text-gray-800">
                  <span className="font-semibold">Resolved:</span> {market.is_resolved ? "Yes" : "No"}
                </p>
                {market.is_resolved && (
                  <p className="text-gray-800">
                    <span className="font-semibold">Outcome:</span>{" "}
                    {market.outcome === null ? (
                      "Not set"
                    ) : market.outcome ? (
                      <span className="text-green-600 flex items-center">
                        Yes <CheckCircle className="ml-1" size={16} />
                      </span>
                    ) : (
                      <span className="text-red-600 flex items-center">
                        No <XCircle className="ml-1" size={16} />
                      </span>
                    )}
                  </p>
                )}
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="text-lg font-semibold mb-2 text-white">Your Prediction</Label>
                  <div className="flex gap-4 mt-2">
                    <Button
                      type="button"
                      variant={prediction === "yes" ? "default" : "outline"}
                      onClick={() => setPrediction("yes")}
                      className="flex-1 py-6"
                    >
                      Yes
                    </Button>
                    <Button
                      type="button"
                      variant={prediction === "no" ? "default" : "outline"}
                      onClick={() => setPrediction("no")}
                      className="flex-1 py-6"
                    >
                      No
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="amount" className="text-lg font-semibold mb-2 text-white">
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="text-lg py-6"
                  />
                </div>
                <Button type="submit" className="w-full py-6 text-lg">
                  Submit Prediction <ArrowRight className="ml-2" size={20} />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}