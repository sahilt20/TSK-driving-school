// Cricket scoring calculation utilities

export function calculateStrikeRate(runs: number, balls: number): number {
  if (balls === 0) return 0
  return (runs / balls) * 100
}

export function calculateEconomyRate(runs: number, balls: number): number {
  if (balls === 0) return 0
  const overs = balls / 6
  return runs / overs
}

export function calculateRunRate(runs: number, overs: number): number {
  if (overs === 0) return 0
  return runs / overs
}

export function calculateRequiredRunRate(target: number, currentRuns: number, ballsRemaining: number): number {
  const runsRequired = target - currentRuns
  if (ballsRemaining === 0) return 0
  const oversRemaining = ballsRemaining / 6
  return runsRequired / oversRemaining
}

export function ballsToOvers(balls: number): string {
  const overs = Math.floor(balls / 6)
  const remainingBalls = balls % 6
  return `${overs}.${remainingBalls}`
}

export function oversToBalls(overs: number): number {
  const completeOvers = Math.floor(overs)
  const balls = (overs - completeOvers) * 10
  return completeOvers * 6 + balls
}

export function formatOvers(balls: number): string {
  return ballsToOvers(balls)
}
