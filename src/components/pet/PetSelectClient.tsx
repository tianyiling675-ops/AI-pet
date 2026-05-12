'use client'
import { useState } from 'react'
import type { PetHomeData, PetId } from '@/types'
import PetSidebar from './PetSidebar'
import PetSpotlight from './PetSpotlight'
import PetDetailPanel from './PetDetailPanel'

interface Props {
  petsData: PetHomeData[]
  userEmail: string
}

export default function PetSelectClient({ petsData, userEmail }: Props) {
  const [selectedId, setSelectedId] = useState<PetId>(petsData[0]?.petId ?? 'ping_an')
  const [playing, setPlaying] = useState(false)
  const selected = petsData.find((p) => p.petId === selectedId) ?? petsData[0]

  return (
    <div className="min-h-screen bg-[#0d0c0b] flex items-center justify-center p-4">
      {/* isolate 创建独立层叠上下文，确保 -z-10 背景留在容器内部 */}
      <div className="w-full max-w-7xl h-[850px] flex gap-6 overflow-hidden relative text-white isolate">

        {/* 背景模糊叠层（仿"阳光感"） */}
        <div className="absolute inset-0 -z-10 opacity-25 pointer-events-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/pets/${selected.petId}.jpg`}
            alt=""
            className="w-full h-full object-cover blur-[80px] scale-110"
          />
        </div>

        <PetSidebar
          petsData={petsData}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        <PetSpotlight
          selected={selected}
          playing={playing}
          onTogglePlay={() => setPlaying((p) => !p)}
          userEmail={userEmail}
          moments={selected.moments}
        />
        <PetDetailPanel
          selected={selected}
        />
      </div>
    </div>
  )
}
