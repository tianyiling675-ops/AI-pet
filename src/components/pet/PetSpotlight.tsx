'use client'
import { useState, useEffect, useRef } from 'react'
import { signOut } from '@/lib/auth-client'
import { PETS, petCopyMap, PET_FALLBACK_BG } from '@/lib/pets'
import type { PetHomeData } from '@/types'

interface Props {
  selected: PetHomeData
  playing: boolean
  onTogglePlay: () => void
  userEmail: string
  moments: string[]
}

export default function PetSpotlight({ selected, playing, onTogglePlay, userEmail, moments }: Props) {
  const [avatarOpen, setAvatarOpen] = useState(false)
  const avatarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false)
      }
    }
    if (avatarOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [avatarOpen])

  return (
    <section className="flex-1 flex flex-col gap-6 min-w-0">

      {/* 顶部控制栏 */}
      <div className="flex justify-end items-center gap-4 pt-4 pr-4 flex-shrink-0">
        <div className="relative" ref={avatarRef}>
          <button
            onClick={() => setAvatarOpen((o) => !o)}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-white text-sm font-semibold select-none">
              {userEmail[0]?.toUpperCase() ?? '?'}
            </div>
            <svg className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </button>

          {avatarOpen && (
            <div className="absolute right-0 top-full mt-2 bg-[#1e1a16] rounded-xl shadow-xl border border-white/10 overflow-hidden z-20 w-28">
              <button
                onClick={() => signOut({ fetchOptions: { onSuccess: () => { window.location.href = '/login' } } })}
                className="w-full text-left px-4 py-3 text-sm text-white/60 hover:bg-white/5 transition-colors"
              >
                退出登录
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 主卡片 */}
      <div className="flex-1 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-[32px] overflow-hidden flex flex-col">
        <div className="p-8 flex flex-col h-full">

          {/* 名字 + 物种 + 心情 + 音乐按钮 */}
          <div className="flex justify-between items-start mb-6 flex-shrink-0">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-5xl font-semibold text-white tracking-tight">
                  {PETS[selected.petId].name}
                </h2>
                <span className="bg-white/10 px-3 py-1 rounded-full text-xs text-white/60 mt-1">
                  {petCopyMap[selected.petId].type}
                </span>
              </div>
              <p className="text-base text-white/70 mt-2 flex items-center gap-2">
                心情：{selected.mood}
                <span className="text-lg">{selected.moodEmoji}</span>
              </p>
            </div>

            <button
              onClick={onTogglePlay}
              className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white/90 transition-all flex-shrink-0"
              aria-label={playing ? '暂停' : '播放'}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                {playing
                  ? <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  : <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                }
              </svg>
            </button>
          </div>

          {/* 宠物图片区域
              背景色放在容器上；img 用 absolute inset-0 避免被 fallback div 遮挡的层叠 bug */}
          <div
            className="flex-1 relative mb-6 min-h-0 rounded-3xl overflow-hidden transition-colors duration-500"
            style={{ background: PET_FALLBACK_BG[selected.petId] }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={selected.petId}
              src={`/pets/${selected.petId}.jpg`}
              alt={PETS[selected.petId].name}
              className="absolute inset-0 w-full h-full object-cover animate-fadeIn"
              onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0' }}
            />

            {/* 渐变遮罩 */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, transparent 60%, rgba(13,12,11,0.8) 100%)' }}
            />

            {/* 引言叠层 */}
            <div className="absolute bottom-8 left-8 max-w-md">
              <div className="relative pl-8 pr-4">
                <span className="absolute top-0 left-0 text-3xl text-[#c08e5f]/40 font-serif leading-none">"</span>
                <p className="text-xl font-light leading-relaxed text-white/70">{selected.quote}</p>
                <span className="absolute -bottom-2 right-0 text-3xl text-[#c08e5f]/40 font-serif leading-none">"</span>
              </div>
            </div>
          </div>

          {/* 它留下的痕迹 */}
          <div className="flex-shrink-0">
            <h3 className="text-sm text-white/40 mb-3 flex items-center gap-2">
              它留下的痕迹
              <span className="text-[#c08e5f]">✦</span>
            </h3>
            {moments.length === 0 ? (
              <p className="text-xs text-white/20">聊天时拍下的照片会出现在这里</p>
            ) : (
              <div className="flex gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex-1 min-w-0">
                    <div className="aspect-[4/3] rounded-xl overflow-hidden mb-1 bg-white/5 border border-white/[0.06]">
                      {moments[i] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={moments[i]}
                          alt=""
                          className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all cursor-pointer"
                        />
                      )}
                    </div>
                  </div>
                ))}
                <div className="w-8 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

    </section>
  )
}
