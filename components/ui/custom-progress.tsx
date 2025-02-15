interface CustomProgressProps {
  yesPercentage: number
  yesCount: number  // Changed to string since we're receiving string from API
  noCount: number   // Changed to string since we're receiving string from API
}

export function CustomProgress({ yesPercentage, yesCount, noCount }: CustomProgressProps) {
  const totalCount = yesCount + noCount;
  
  // Handle case when there are no votes
  const effectiveYesPercentage = totalCount === 0 ? 50 : yesPercentage
  const effectiveNoPercentage = totalCount === 0 ? 50 : (100 - yesPercentage)

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-green-700">
          Yes: {yesCount} {totalCount === 0 && "(50%)"}
        </span>
        <span className="text-sm font-medium text-red-700">
          No: {noCount} {totalCount === 0 && "(50%)"}
        </span>
      </div>
      <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-300 ease-in-out"
          style={{ 
            width: `${effectiveYesPercentage}%`,
            opacity: totalCount === 0 ? 0.5 : 1 
          }}
        >
          <div
            className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-300 ease-in-out"
            style={{ 
              width: `${totalCount === 0 ? 50 : (noCount / totalCount) * 100}%`,
              opacity: totalCount === 0 ? 0.5 : 1 
            }}
          />
        </div>
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs font-medium text-gray-600">
          {totalCount === 0 ? "50.0" : effectiveYesPercentage.toFixed(1)}%
        </span>
        <span className="text-xs font-medium text-gray-600">
          {totalCount === 0 ? "50.0" : effectiveNoPercentage.toFixed(1)}%
        </span>
      </div>
    </div>
  )
}