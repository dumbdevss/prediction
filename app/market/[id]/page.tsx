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
import { ArrowRight, CheckCircle, XCircle, Loader2 } from "lucide-react"
import decodeUrlString from "@/utils/special"
import aptos from "@/lib/aptos"
import { useToast } from "@/lib/use-toast"

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

type MarketResult = [string, string, string, string, string, string]
type PredictionCountsResult = [string, string]
type PredictionOddsResult = [string, string]

const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
      <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-2" />
      <p className="text-gray-800 font-medium">Processing your prediction...</p>
    </div>
  </div>
);

export default function MarketDetail(): React.ReactElement {
  const params = useParams()
  const { signAndSubmitTransaction } = useWallet();
  const marketId: string = params.id as string
  const [market, setMarket] = useState<Market | null>(null)
  const [prediction, setPrediction] = useState<"yes" | "no" | null>(null)
  const [amount, setAmount] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [predictionCounts, setPredictionCounts] = useState<[string, string]>(['0', '0'])
  const [predictionOdds, setPredictionOdds] = useState<[string, string]>(['0', '0'])
  const { toast, success, error: showerror } = useToast()

  useEffect(() => {
    const fetchMarketData = async (): Promise<void> => {
      setIsLoading(true)
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

        setMarket(marketData)
        setPredictionCounts(countsResult as [string, string])
        setPredictionOdds(oddsResult as [string, string])
      } catch (error) {
        console.error("Error fetching market data:", error)
        showerror("Error fetching market data:");
      } finally {
        setIsLoading(false)
      }
    }

    fetchMarketData()
  }, [marketId])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (prediction === null) {
      showerror("Please select a prediction");
      return;
    }

    setIsSubmitting(true);

    const transactionPayload: InputEntryFunctionData = {
      function: `${process.env.NEXT_PUBLIC_MODULE_ADDRESS}::PredictionMarkets::make_prediction`,
      functionArguments: [decodeUrlString(marketId), prediction === "yes"],
    };

    try {
      const response: any = await signAndSubmitTransaction({ 
        payload: transactionPayload 
      });
      
      console.log(`Transaction submitted: https://explorer.movementlabs.xyz/txn/${response.hash}?network=bardock_testnet`);
      success("Prediction submitted successfully!")
      
    } catch (error) {
      console.error("Error submitting transaction:", error);
      if (error instanceof Error) {
        showerror(`Failed to submit prediction: ${error.message}`);
      } else {
        showerror("Failed to submit prediction. Please try again.");
      }
    } finally {      
      setIsSubmitting(false);
      setPrediction(null);
      setAmount("");
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading market data...</p>
        </div>
      </div>
    )
  }

  if (!market) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-red-50 p-6 rounded-lg">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-700 mb-2">Market Not Found</h2>
          <p className="text-gray-600">The market you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }

  const totalPredictions = parseInt(predictionCounts[0] as string) + parseInt(predictionCounts[1] as string);
  const yesPercentage = (parseInt(predictionCounts[0] as string) / totalPredictions) * 100 || 0;

  return (
    <main className="flex min-h-screen flex-col items-center overflow-x-clip pt-6 md:pt-12 lg:pt-24">
      {isSubmitting && <LoadingOverlay />}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header />
        <div className="max-w-3xl mt-16 mx-auto">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-white mb-2 break-words">
              {market.question}
            </h1>
            <p className="text-center text-gray-200 text-sm sm:text-base">Created by: {market.creator_username}</p>
          </div>
          
          <Card className="overflow-hidden shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl">Market Details</CardTitle>
              <CardDescription className="text-gray-100">Predict the outcome</CardDescription>
            </CardHeader>
            
            <CardContent className="p-4 sm:p-6">
              <CustomProgress yesPercentage={yesPercentage} yesCount={parseInt(predictionCounts[0])} noCount={parseInt(predictionCounts[1])} />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 my-4 sm:my-6">
                <div className="bg-green-100 p-4 rounded-lg text-center">
                  <p className="font-semibold text-base sm:text-lg mb-2 text-green-800">Yes</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">{predictionOdds[0]}%</p>
                  <p className="text-green-700 text-sm sm:text-base">{predictionCounts[0]} predictions</p>
                </div>
                <div className="bg-red-100 p-4 rounded-lg text-center">
                  <p className="font-semibold text-base sm:text-lg mb-2 text-red-800">No</p>
                  <p className="text-xl sm:text-2xl font-bold text-red-600">{predictionOdds[1]}%</p>
                  <p className="text-red-700 text-sm sm:text-base">{predictionCounts[1]} predictions</p>
                </div>
              </div>
              
              <p className="text-center mb-4 text-gray-600">Total Predictions: {totalPredictions}</p>
              
              <div className="bg-gray-100 p-4 rounded-lg mb-6">
                <p className="mb-2 text-gray-800 text-sm sm:text-base">
                  <span className="font-semibold">Market Question:</span> {market.question}
                </p>
                <p className="mb-2 text-gray-800 text-sm sm:text-base">
                  <span className="font-semibold">Resolved:</span> {market.is_resolved ? "Yes" : "No"}
                </p>
                {market.is_resolved && (
                  <p className="text-gray-800 text-sm sm:text-base">
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
                  <Label className="text-base sm:text-lg font-semibold mb-2 text-gray-800">Your Prediction</Label>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2">
                    <Button
                      type="button"
                      variant={prediction === "yes" ? "default" : "outline"}
                      onClick={() => setPrediction("yes")}
                      className="flex-1 py-4 sm:py-6"
                      disabled={isSubmitting}
                    >
                      Yes
                    </Button>
                    <Button
                      type="button"
                      variant={prediction === "no" ? "default" : "outline"}
                      onClick={() => setPrediction("no")}
                      className="flex-1 py-4 sm:py-6"
                      disabled={isSubmitting}
                    >
                      No
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="amount" className="text-base sm:text-lg font-semibold mb-2 text-gray-800">
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="text-base sm:text-lg py-4 sm:py-6"
                    disabled={isSubmitting}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full py-4 sm:py-6 text-base sm:text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Submit Prediction <ArrowRight className="ml-2" size={20} />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}