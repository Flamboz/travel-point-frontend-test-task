export function formatRuntime(runtime: number | null): string | null {
  if (!runtime) {
    return null
  }

  const hours = Math.floor(runtime / 60)
  const minutes = runtime % 60

  if (hours === 0) {
    return `${minutes}m`
  }

  if (minutes === 0) {
    return `${hours}h`
  }

  return `${hours}h ${minutes}m`
}

export function formatMoney(amount: number): string | null {
  if (!amount) {
    return null
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatList(values: string[]): string {
  return values.length > 0 ? values.join(', ') : 'Unknown'
}
