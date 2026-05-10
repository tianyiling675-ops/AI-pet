import type { ChatMessage } from '@/types'

interface Props {
  message: ChatMessage
  petEmoji: string
}

export default function MessageBubble({ message, petEmoji }: Props) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="bubble-user whitespace-pre-wrap">{message.content}</div>
      </div>
    )
  }

  return (
    <div className="flex items-end gap-2">
      <span className="text-xl flex-shrink-0 mb-0.5">{petEmoji}</span>
      <div className="flex flex-col gap-2">
        <div className="bubble-pet whitespace-pre-wrap">{message.content}</div>
        {message.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={message.imageUrl}
            alt="宠物照片"
            className="rounded-2xl max-w-[240px] w-full object-cover"
          />
        )}
      </div>
    </div>
  )
}
