const sizeUnits = ['B', 'KB', 'MB', 'GB']
const priceFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const dateFormat = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' })

export function formatFileSize(bytes: number): string {
  let size = bytes
  let unitIndex = 0
  while (size >= 1024 && unitIndex < sizeUnits.length - 1) {
    size /= 1024
    unitIndex += 1
  }

  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${sizeUnits[unitIndex]}`
}

export function formatDuration(seconds: number): string {
  if (seconds <= 0) {
    return 'No content yet'
  }

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.round((seconds % 3600) / 60)
  if (hours === 0) {
    return `${minutes} min`
  }

  return `${hours} h ${minutes} min`
}

export function formatPrice(price: string): string {
  const amount = Number(price)

  return amount === 0 ? 'Free' : priceFormat.format(amount)
}

export function formatRating(rating: string | null, ratingCount: number): string {
  if (rating === null || ratingCount === 0) {
    return 'Not rated'
  }

  return `${Number(rating).toFixed(1)} (${ratingCount})`
}

export function formatDate(date: Date): string {
  return dateFormat.format(date)
}
