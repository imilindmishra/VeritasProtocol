"use client"

import { useEffect, useState } from "react"

interface DonutChartProps {
  yesPercentage: number
  noPercentage: number
}

export default function DonutChart({ yesPercentage, noPercentage }: DonutChartProps) {
  const [animatedYes, setAnimatedYes] = useState(0)
  const [animatedNo, setAnimatedNo] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedYes(yesPercentage)
      setAnimatedNo(noPercentage)
    }, 100)
    return () => clearTimeout(timer)
  }, [yesPercentage, noPercentage])

  const radius = 80
  const strokeWidth = 16
  const normalizedRadius = radius - strokeWidth * 2
  const circumference = normalizedRadius * 2 * Math.PI

  const yesStrokeDasharray = `${(animatedYes / 100) * circumference} ${circumference}`
  const noStrokeDasharray = `${(animatedNo / 100) * circumference} ${circumference}`
  const noStrokeDashoffset = -((animatedYes / 100) * circumference)

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            stroke="#374151"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />

          {/* Yes percentage */}
          <circle
            stroke="#39FF14"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={yesStrokeDasharray}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-1000 ease-out"
            style={{
              filter: "drop-shadow(0 0 8px rgba(57, 255, 20, 0.6))",
            }}
          />

          {/* No percentage */}
          <circle
            stroke="#BF40BF"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={noStrokeDasharray}
            strokeDashoffset={noStrokeDashoffset}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-1000 ease-out"
            style={{
              filter: "drop-shadow(0 0 8px rgba(191, 64, 191, 0.6))",
            }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-neon-green">{animatedYes}%</div>
            <div className="text-sm text-gray-400">YES</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center space-x-6 mt-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-neon-green rounded-full mr-2"></div>
          <span className="text-neon-green font-semibold">{animatedYes}% YES</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-electric-purple rounded-full mr-2"></div>
          <span className="text-electric-purple font-semibold">{animatedNo}% NO</span>
        </div>
      </div>
    </div>
  )
}
