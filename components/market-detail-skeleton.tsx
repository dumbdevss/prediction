import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function MarketDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg p-6 mb-8">
        <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
        <Skeleton className="h-4 w-1/2 mx-auto" />
      </div>
      <Card className="overflow-hidden shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500">
          <CardTitle className="text-2xl"><Skeleton className="h-8 w-1/2" /></CardTitle>
          <Skeleton className="h-4 w-1/3" />
        </CardHeader>
        <CardContent className="p-6">
          <Skeleton className="h-4 w-full mb-4" />
          <div className="grid grid-cols-2 gap-6 my-6">
            {[0, 1].map((i) => (
              <div key={i} className="p-4 rounded-lg">
                <Skeleton className="h-6 w-1/4 mb-2" />
                <Skeleton className="h-8 w-1/2 mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
          <Skeleton className="h-4 w-1/3 mx-auto mb-4" />
          <Skeleton className="h-24 w-full mb-6" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/4 mb-2" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
            <Skeleton className="h-6 w-1/4 mb-2" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
