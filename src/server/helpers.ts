export function hasSameIds(current: number[], sent: number[]): boolean {
  const sentIds = new Set(sent)

  return (
    sentIds.size === sent.length &&
    sent.length === current.length &&
    current.every((i) => sentIds.has(i))
  )
}
