import { useState } from 'react'

function ShieldSvg({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M12 8v4" />
      <circle cx="12" cy="16" r="0.5" fill="currentColor" />
    </svg>
  )
}

export function SafetyIcon() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-warning"
        aria-label="Safety information"
      >
        <ShieldSvg />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-[390px] rounded-t-2xl bg-bg-primary p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Safety warning"
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-text-secondary/30" />
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning-surface text-warning">
                <ShieldSvg size={24} />
              </div>
              <h2 className="text-lg font-bold text-text-primary">
                Stop &amp; Seek Help
              </h2>
              <p className="text-sm leading-relaxed text-text-secondary">
                If you feel dizzy, chest pain, or unusual shortness of breath,
                stop immediately and seek help.
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-2 min-h-[48px] w-full rounded-[16px] bg-bg-warm px-4 py-3 text-sm font-semibold text-text-primary"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
