'use client'
import Link from 'next/link'
import { PETS, PET_FALLBACK_BG } from '@/lib/pets'
import type { PetHomeData, PetId } from '@/types'

interface Props {
  petsData: PetHomeData[]
  selectedId: PetId
  onSelect: (id: PetId) => void
}

const DOT_COLOR: Record<PetId, string> = {
  ping_an: '#4ade80',
  mo:      '#4ade80',
  chi:     '#fb923c',
  hawk:    '#a78bfa',
}

const SIDE_ICON: Record<PetId, string> = {
  ping_an: '🐱',
  mo:      '🐾',
  chi:     '🐉',
  hawk:    '🪶',
}

export default function PetSidebar({ petsData, selectedId, onSelect }: Props) {
  return (
    <aside className="w-64 flex-shrink-0 flex flex-col justify-between overflow-y-auto scrollbar-hide py-4">

      <div className="flex flex-col flex-1 gap-6">
        {/* 品牌标语 */}
        <div className="pl-2 mb-2">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-[#c08e5f] opacity-80" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
            </svg>
          </div>
          <p className="text-lg font-medium tracking-tight text-white/90 leading-snug ml-7">
            它们不会催你变好，
          </p>
          <p className="text-lg font-medium tracking-tight text-white/90 leading-snug ml-7">
            只会用自己的方式留下。
          </p>
        </div>

        {/* 宠物卡片列表 */}
        <nav className="flex flex-col gap-3">
          {petsData.map((pet) => {
            const isSelected = pet.petId === selectedId
            const petName = PETS[pet.petId].name

            return (
              <button
                key={pet.petId}
                onClick={() => onSelect(pet.petId)}
                className={[
                  'flex items-center gap-3 w-full rounded-2xl py-6 px-4 text-left transition-all duration-200',
                  isSelected
                    ? 'bg-white/[0.03] backdrop-blur-xl border border-[#c08e5f]/50 shadow-[0_0_15px_rgba(192,142,95,0.2)]'
                    : 'bg-white/5 border border-transparent hover:bg-white/10',
                ].join(' ')}
              >
                {/* 宠物缩略图 */}
                <div
                  className="w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden"
                  style={{ background: PET_FALLBACK_BG[pet.petId] }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/pets/${pet.petId}.jpg`}
                    alt={petName}
                    className={[
                      'w-full h-full object-cover transition-opacity duration-200',
                      isSelected ? 'opacity-100' : 'opacity-60',
                    ].join(' ')}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                </div>

                {/* 文字区域 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={[
                      'font-medium text-base truncate',
                      isSelected ? 'text-white' : 'text-white/50',
                    ].join(' ')}>
                      {petName}
                    </span>
                    <span className={[
                      'text-sm flex-shrink-0 ml-2',
                      isSelected ? 'opacity-40' : 'opacity-20',
                    ].join(' ')}>
                      {SIDE_ICON[pet.petId]}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: DOT_COLOR[pet.petId] }}
                    />
                    <span className={[
                      'text-xs truncate',
                      isSelected ? 'text-[#c08e5f]' : 'text-white/40',
                    ].join(' ')}>
                      {pet.status}
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </nav>
      </div>

      {/* 底部导航 */}
      <div className="px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-white/40 text-sm hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
          <span>回到我的空间</span>
        </Link>
      </div>

    </aside>
  )
}
