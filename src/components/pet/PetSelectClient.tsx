'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { PETS, petCopyMap } from '@/lib/pets'
import type { PetHomeData, PetId } from '@/types'

interface Props {
  petsData: PetHomeData[]
  userEmail: string
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

const FALLBACK_BG: Record<PetId, string> = {
  ping_an: '#5c3d1e',
  mo:      '#2c3a4a',
  chi:     '#5c1e1e',
  hawk:    '#2a2a2a',
}

export default function PetSelectClient({ petsData, userEmail }: Props) {
  const [selectedId, setSelectedId] = useState<PetId>(petsData[0]?.petId ?? 'ping_an')
  const [playing, setPlaying] = useState(false)
  const [avatarOpen, setAvatarOpen] = useState(false)
  const avatarRef = useRef<HTMLDivElement>(null)
  const selected = petsData.find((p) => p.petId === selectedId) ?? petsData[0]

  // 点击下拉菜单外部时关闭
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
    <div className="h-screen w-screen overflow-hidden bg-[#1c1409] text-white grid grid-cols-[280px_1fr_320px]">

      {/* ── 左侧：宠物列表 ── */}
      <aside className="flex flex-col bg-[#1c1409] border-r border-white/5 overflow-y-auto scrollbar-hide">

        {/* 品牌标语 */}
        <div className="px-5 pt-10 pb-6 flex-shrink-0">
          <span className="text-amber-400/80 text-lg">🍃</span>
          <p className="mt-3 text-sm font-medium text-white/80 leading-relaxed tracking-wide">
            它们不会催你变好，
            <br />只会用自己的方式留下。
          </p>
        </div>

        {/* 宠物卡片列表 */}
        <nav className="flex flex-col gap-2 px-3 flex-1">
          {petsData.map((pet) => {
            const isSelected = pet.petId === selectedId
            const petName = PETS[pet.petId].name

            return (
              <button
                key={pet.petId}
                onClick={() => setSelectedId(pet.petId)}
                className={[
                  'flex items-center gap-3 w-full rounded-2xl px-3 py-3 text-left transition-all duration-200',
                  isSelected
                    ? 'border border-amber-400/50 bg-white/8 shadow-[0_0_12px_rgba(251,191,36,0.08)]'
                    : 'border border-transparent bg-white/[0.03] hover:bg-white/[0.06]',
                ].join(' ')}
              >
                {/* 宠物缩略图 */}
                <div
                  className="w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden"
                  style={{ background: FALLBACK_BG[pet.petId] }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/pets/${pet.petId}.jpg`}
                    alt={petName}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                </div>

                {/* 文字区域 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-base text-white/95 truncate">
                      {petName}
                    </span>
                    <span className="text-white/25 text-sm flex-shrink-0 ml-2">
                      {SIDE_ICON[pet.petId]}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: DOT_COLOR[pet.petId] }}
                    />
                    <span className="text-xs text-white/45 truncate">
                      {pet.status}
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </nav>

        {/* 底部导航 */}
        <div className="px-5 py-6 flex-shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/30 text-xs hover:text-white/50 transition-colors"
          >
            <span>🏠</span>
            <span>回到我的空间</span>
          </Link>
        </div>

      </aside>

      {/* ── 中间：宠物大图聚焦 ── */}
      <main className="relative overflow-hidden">

        {/* 备用背景色（图片未加载时显示） */}
        <div
          className="absolute inset-0 transition-colors duration-500"
          style={{ background: FALLBACK_BG[selected.petId] }}
        />

        {/* 宠物大图 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={selected.petId}
          src={`/pets/${selected.petId}.jpg`}
          alt={PETS[selected.petId].name}
          className="absolute inset-0 w-full h-full object-cover animate-fadeIn"
          onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0' }}
        />

        {/* 顶部渐变遮罩 */}
        <div className="absolute inset-x-0 top-0 h-52 bg-gradient-to-b from-black/65 to-transparent pointer-events-none" />

        {/* 底部渐变遮罩 */}
        <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

        {/* 顶部内容：名字 + 物种 + 心情 + 音乐按钮 */}
        <div className="absolute top-0 inset-x-0 p-8 flex items-start justify-between">
          <div>
            <div className="flex items-baseline gap-3">
              <h1 className="text-5xl font-bold text-white tracking-tight">
                {PETS[selected.petId].name}
              </h1>
              <span className="text-sm text-white/60 bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full">
                {petCopyMap[selected.petId].type}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2.5">
              <span className="text-sm text-white/60">心情：{selected.mood}</span>
              <span className="text-base">{selected.moodEmoji}</span>
            </div>
          </div>

          {/* 音乐按钮（纯前端） */}
          <button
            onClick={() => setPlaying((p) => !p)}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white/90 transition-all"
            aria-label={playing ? '暂停' : '播放'}
          >
            {playing ? '⏸' : '♪'}
          </button>
        </div>

        {/* 底部内容：宠物引言 */}
        <div className="absolute bottom-10 inset-x-0 px-8">
          <div className="flex gap-2 items-start">
            <span className="text-amber-400/70 text-4xl font-serif leading-none flex-shrink-0 -mt-1">
              "
            </span>
            <p className="text-white/90 text-lg leading-relaxed flex-1">
              {selected.quote}
            </p>
            <span className="text-amber-400/70 text-4xl font-serif leading-none flex-shrink-0 self-end mb-1">
              "
            </span>
          </div>
        </div>

      </main>

      {/* ── 右侧：信息面板 ── */}
      <aside className="flex flex-col bg-[#f5ede0] text-[#2a1f12] overflow-y-auto scrollbar-hide">

        {/* 用户头像区 */}
        <div className="flex justify-end px-6 pt-5 pb-2 flex-shrink-0">
          <div className="relative" ref={avatarRef}>
            <button
              onClick={() => setAvatarOpen((o) => !o)}
              className="flex items-center gap-1.5 group"
            >
              {/* 头像圆圈：邮箱首字母 */}
              <div className="w-8 h-8 rounded-full bg-[#7a4f2d] flex items-center justify-center text-white text-sm font-semibold select-none">
                {userEmail[0]?.toUpperCase() ?? '?'}
              </div>
              <span className="text-[#2a1f12]/35 text-xs group-hover:text-[#2a1f12]/55 transition-colors">
                ∨
              </span>
            </button>

            {/* 下拉菜单 */}
            {avatarOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-md border border-[#2a1f12]/8 overflow-hidden z-20 w-28">
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="w-full text-left px-4 py-3 text-sm text-[#2a1f12]/65 hover:bg-[#f5ede0] transition-colors"
                >
                  退出登录
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col flex-1 px-6 pb-6 gap-7">

          {/* 刚才想对你说 */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <span className="text-amber-700/50 text-xs">✦</span>
                <span className="text-xs text-[#2a1f12]/45 font-medium tracking-wide">
                  刚才想对你说
                </span>
              </div>
            </div>
            <p className="text-sm text-[#2a1f12]/75 leading-relaxed">
              {selected.quote}
            </p>
          </section>

          {/* 分隔线 */}
          <div className="border-t border-[#2a1f12]/8" />

          {/* 今天记得的事 */}
          <section>
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-[#2a1f12]/35 text-xs">📖</span>
              <span className="text-xs text-[#2a1f12]/45 font-medium tracking-wide">
                今天记得的事
              </span>
            </div>
            {selected.diary.length > 0 ? (
              <ul className="space-y-2.5">
                {selected.diary.map((entry, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-1 h-1 rounded-full bg-[#2a1f12]/25 mt-2 flex-shrink-0" />
                    <span className="text-sm text-[#2a1f12]/65 leading-relaxed">
                      {entry}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[#2a1f12]/35 leading-relaxed">
                {petCopyMap[selected.petId].emptyDiary}
              </p>
            )}
          </section>

          {/* 弹性留白，把按钮推到底部 */}
          <div className="flex-1" />

          {/* 进入聊天按钮 */}
          <Link
            href={`/chat/${selected.petId}`}
            className="flex items-center justify-between w-full bg-[#7a4f2d] hover:bg-[#6b4426] text-white rounded-2xl px-5 py-4 transition-colors duration-200 group"
          >
            <div>
              <p className="font-semibold text-base">
                {petCopyMap[selected.petId].cta}
              </p>
              <p className="text-xs text-white/55 mt-0.5">它可能正在等你</p>
            </div>
            <span className="text-white/50 group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </Link>

        </div>
      </aside>

    </div>
  )
}
