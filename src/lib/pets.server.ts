import 'server-only'
import { petCopyMap } from '@/lib/pets'
import type { PetId } from '@/types'

export function pickQuote(petId: PetId): string {
  const quotes = petCopyMap[petId].quotes
  return quotes[Math.floor(Math.random() * quotes.length)]
}

export function pickQuotesForAllPets(): Record<PetId, string> {
  return {
    ping_an: pickQuote('ping_an'),
    mo:      pickQuote('mo'),
    chi:     pickQuote('chi'),
    hawk:    pickQuote('hawk'),
  }
}
