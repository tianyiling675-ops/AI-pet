'use client'
import Link from 'next/link'
import { petCopyMap } from '@/lib/pets'
import type { PetHomeData } from '@/types'

interface Props {
  selected: PetHomeData
}

export default function PetDetailPanel({ selected }: Props) {
  return (
    <aside className="w-80 flex-shrink-0 flex flex-col bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-[32px] text-white overflow-y-auto scrollbar-hide">

      <div className="flex flex-col flex-1 px-6 py-6 gap-6">

        {/* 刚才想对你说 */}
        <section>
          <div className="flex items-center gap-1.5 mb-3">
            <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
            <span className="text-xs text-white/40 font-medium tracking-wide">刚才想对你说</span>
            <span className="text-[#c08e5f] text-xs ml-auto">✦</span>
          </div>
          <div className="bg-white/5 rounded-2xl px-4 py-3">
            <p className="text-sm text-white/80 leading-relaxed">{selected.quote}</p>
            <div className="flex justify-between items-center mt-3">
              <span className="text-[10px] text-white/20">刚刚</span>
              <svg className="w-3 h-3 text-white/20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L9 9l-8 3 8 3 3 8 3-8 8-3-8-3-3-8z" />
              </svg>
            </div>
          </div>
        </section>

        <div className="border-t border-white/[0.06]" />

        {/* 今天记得的事 */}
        <section>
          <div className="flex items-center gap-1.5 mb-3">
            <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
            <span className="text-xs text-white/40 font-medium tracking-wide">今天记得的事</span>
          </div>
          {selected.diary.length > 0 ? (
            <div className="space-y-2">
              {selected.diary.map((entry, i) => (
                <div key={i} className="bg-white/5 border border-white/5 px-4 py-3 rounded-xl flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full bg-[#c08e5f]/50 flex-shrink-0 mt-1.5" />
                  <span className="text-xs text-white/60 leading-relaxed">{entry}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-white/25 leading-relaxed">
              {petCopyMap[selected.petId].emptyDiary}
            </p>
          )}
        </section>

        <div className="border-t border-white/[0.06]" />

        {/* 我们的片刻 */}
        <section>
          <div className="flex items-center gap-1.5 mb-3">
            <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
            <span className="text-xs text-white/40 font-medium tracking-wide">我们的片刻</span>
          </div>
          <div className="relative group cursor-pointer">
            <div className="w-full aspect-video rounded-xl bg-white/5 border border-white/5 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4 ml-0.5" fill="white" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-[10px] text-white/30">--:--</span>
            </div>
            <p className="text-[11px] text-white/40 mt-1">聊天时的片刻会出现在这里</p>
          </div>
        </section>

        <div className="flex-1" />

        {/* 进入聊天按钮 */}
        <Link
          href={`/chat/${selected.petId}`}
          className="flex items-center justify-between w-full text-white rounded-3xl px-5 py-6 transition-all duration-200 hover:opacity-90 hover:-translate-y-px group relative overflow-hidden shadow-[0_4px_20px_rgba(192,142,95,0.2)]"
          style={{ background: 'linear-gradient(135deg, #a67c52 0%, #7a5a3a 100%)' }}
        >
          <div>
            <p className="font-semibold text-base">{petCopyMap[selected.petId].cta}</p>
            <p className="text-xs text-white/55 mt-0.5">它可能正在等你</p>
          </div>
          <svg className="w-5 h-5 text-white/70 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
          <div className="absolute inset-0 border border-white/20 rounded-3xl pointer-events-none" />
        </Link>

      </div>
    </aside>
  )
}
