import Link from 'next/link'
import type { PetConfig, PetState, PetId } from '@/types'

interface Props {
  pets: Record<PetId, PetConfig>
  states: PetState[]
}

const PET_BG: Record<PetId, string> = {
  ping_an: 'bg-amber-50',
  mo: 'bg-slate-50',
  chi: 'bg-red-50',
  hawk: 'bg-stone-50',
}

export default function PetGrid({ pets, states }: Props) {
  const stateMap = Object.fromEntries(states.map((s) => [s.pet_id, s]))

  return (
    <div className="grid grid-cols-2 gap-4">
      {Object.values(pets).map((pet) => {
        const state = stateMap[pet.id] as PetState | undefined
        return (
          <Link
            key={pet.id}
            href={`/chat/${pet.id}`}
            className={`${PET_BG[pet.id]} rounded-2xl p-5 flex flex-col gap-3 active:scale-[0.97] transition-transform`}
          >
            <span className="text-4xl">{pet.emoji}</span>
            <div>
              <p className="font-medium text-gray-800">{pet.name}</p>
              <p className="text-xs text-gray-400">{pet.species}</p>
            </div>
            {state && (
              <div className="flex items-center gap-1.5 mt-auto">
                <span className="text-base">{state.mood_emoji}</span>
                <span className="text-xs text-gray-500">{state.mood}</span>
              </div>
            )}
          </Link>
        )
      })}
    </div>
  )
}
