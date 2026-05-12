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
  const [showDetail, setShowDetail] = useState(false)
  const selected = petsData.find((p) => p.petId === selectedId) ?? petsData[0]

  return (
    <div className="min-h-screen bg-[#0d0c0b] text-white">

      {/* ── 桌面布局 ── */}
      <div className="hidden lg:flex items-center justify-center p-4 min-h-screen">
        <div className="w-full max-w-7xl h-[850px] flex gap-6 overflow-hidden relative isolate">
          <div className="absolute inset-0 -z-10 opacity-25 pointer-events-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/pets/${selected.petId}.jpg`} alt=""
              className="w-full h-full object-cover blur-[80px] scale-110" />
          </div>
          <PetSidebar petsData={petsData} selectedId={selectedId} onSelect={setSelectedId} />
          <PetSpotlight selected={selected} playing={playing}
            onTogglePlay={() => setPlaying((p) => !p)} userEmail={userEmail} moments={selected.moments} />
          <PetDetailPanel selected={selected} />
        </div>
      </div>

      {/* ── 移动端布局 ── */}
      <div className="lg:hidden flex flex-col min-h-screen relative">

        {/* 背景模糊 */}
        <div className="fixed inset-0 -z-10 opacity-30 pointer-events-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/pets/${selected.petId}.jpg`} alt=""
            className="w-full h-full object-cover blur-[60px] scale-110" />
          <div className="absolute inset-0 bg-[#0d0c0b]/60" />
        </div>

        {/* 顶部：水平宠物选择器 */}
        <div className="flex-shrink-0 px-4 pt-12 pb-4">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
            {petsData.map((pet) => {
              const isSelected = pet.petId === selectedId
              return (
                <button
                  key={pet.petId}
                  onClick={() => setSelectedId(pet.petId)}
                  className="flex-shrink-0 flex flex-col items-center gap-2"
                >
                  <div className={['w-16 h-16 rounded-2xl overflow-hidden transition-all',
                    isSelected ? 'ring-2 ring-[#c08e5f] ring-offset-2 ring-offset-[#0d0c0b] scale-105' : 'opacity-50',
                  ].join(' ')}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/pets/${pet.petId}.jpg`} alt={pet.petId}
                      className="w-full h-full object-cover" />
                  </div>
                  <span className={['text-xs transition-colors',
                    isSelected ? 'text-[#c08e5f]' : 'text-white/40',
                  ].join(' ')}>
                    {pet.petId === 'ping_an' ? '平安' : pet.petId === 'mo' ? '默' : pet.petId === 'chi' ? '赤' : '鹰'}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 宠物图片大图 */}
        <div className="flex-shrink-0 px-4">
          <div className="relative rounded-3xl overflow-hidden aspect-[4/3]"
            style={{ background: '#2c1a0e' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/pets/${selected.petId}.jpg`} alt={selected.petId}
              className="w-full h-full object-cover" />
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(13,12,11,0.85) 100%)' }} />
            {/* 引言 */}
            <div className="absolute bottom-5 left-5 right-5">
              <p className="text-sm text-white/75 leading-relaxed">「{selected.quote}」</p>
            </div>
          </div>
        </div>

        {/* 宠物信息 */}
        <div className="flex-shrink-0 px-4 pt-4 flex items-center justify-between">
          <div>
            <p className="text-2xl font-semibold">
              {selected.petId === 'ping_an' ? '平安' : selected.petId === 'mo' ? '默' : selected.petId === 'chi' ? '赤' : '鹰'}
            </p>
            <p className="text-sm text-white/50 mt-0.5">{selected.mood} {selected.moodEmoji}</p>
          </div>
          <button
            onClick={() => setShowDetail((v) => !v)}
            className="text-xs text-[#c08e5f]/70 border border-[#c08e5f]/20 rounded-xl px-3 py-2"
          >
            {showDetail ? '收起' : '它记得'}
          </button>
        </div>

        {/* 可折叠详情 */}
        {showDetail && (
          <div className="flex-shrink-0 mx-4 mt-3 rounded-2xl p-4 space-y-3"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {selected.diary.length > 0 ? selected.diary.map((d, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="w-1 h-1 rounded-full bg-[#c08e5f]/50 mt-2 flex-shrink-0" />
                <span className="text-xs text-white/60 leading-relaxed">{d}</span>
              </div>
            )) : (
              <p className="text-xs text-white/30">还没有记忆，去聊聊吧。</p>
            )}
          </div>
        )}

        {/* 进入聊天按钮 */}
        <div className="flex-1 flex items-end px-4 pb-8 pt-6">
          <a
            href={`/chat/${selected.petId}`}
            className="flex items-center justify-between w-full text-white rounded-2xl px-5 py-5 transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #a67c52 0%, #7a5a3a 100%)' }}
          >
            <div>
              <p className="font-semibold">
                {selected.petId === 'ping_an' ? '去找平安聊聊' :
                  selected.petId === 'mo' ? '坐到默旁边' :
                    selected.petId === 'chi' ? '听赤汇报' : '看看鹰是否还在'}
              </p>
              <p className="text-xs text-white/55 mt-0.5">它可能正在等你</p>
            </div>
            <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </a>
        </div>
      </div>

    </div>
  )
}
