import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

interface OSWindowBarProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  onClose?: () => void
  onMinimize?: () => void
  onMaximize?: () => void
}

export function OSWindowBar({
  title,
  onClose,
  onMinimize,
  onMaximize,
  className,
  ...props
}: OSWindowBarProps) {
  return (
    <div
      {...props}
      className={cn(
        'flex items-center justify-between px-3 py-2 bg-black border-b-2 border-black select-none',
        className,
      )}
    >
      {/* Window title */}
      <span className="text-xs font-bold uppercase tracking-widest text-[#1acb5b] font-[Space_Grotesk,sans-serif] truncate">
        {title ?? 'WINDOW'}
      </span>

      {/* Window controls */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={onMinimize}
          aria-label="Minimize"
          className="w-5 h-5 bg-yellow-400 border border-black text-black text-[10px] font-bold flex items-center justify-center hover:bg-yellow-300 transition-colors"
        >
          –
        </button>
        <button
          type="button"
          onClick={onMaximize}
          aria-label="Maximize"
          className="w-5 h-5 bg-[#1acb5b] border border-black text-black text-[10px] font-bold flex items-center justify-center hover:bg-[#17b04f] transition-colors"
        >
          □
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="w-5 h-5 bg-red-500 border border-black text-white text-[10px] font-bold flex items-center justify-center hover:bg-red-400 transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  )
}
