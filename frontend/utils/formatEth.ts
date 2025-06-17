export function formatEth(value: number | string): string {
  const numValue = typeof value === "string" ? Number.parseFloat(value) : value

  if (isNaN(numValue)) return "0.000 ETH"

  return `${numValue.toFixed(3)} ETH`
}

export function formatUsd(ethValue: number | string, ethPrice = 2500): string {
  const numValue = typeof ethValue === "string" ? Number.parseFloat(ethValue) : ethValue

  if (isNaN(numValue)) return "$0.00"

  const usdValue = numValue * ethPrice
  return `$${usdValue.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}

export function truncateAddress(address: string): string {
  if (!address || address.length < 10) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}
