import { useState } from 'react'
import { Button } from './ui'

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
      <circle cx="12" cy="10" r="0.5" fill="currentColor" />
      <path d="M12 13v3" />
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
        className="flex h-14 w-14 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-text-primary/5 hover:text-text-primary active:bg-text-primary/10 active:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
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
            {/* 2026-04-20 physio-review: the prior single sentence
                ("dizzy, chest pain, or unusual shortness of breath")
                conflated two actions — call emergency services vs see
                a clinician — and gave no number. Split into (1) a
                specific emergency list with a real number to dial,
                (2) a head-impact line volleyball players need that
                wasn't there at all, and (3) a non-emergency clinician
                line. Kept tight enough to stay scannable; neuro flags
                (one-sided weakness, sudden vision change) are
                deliberately left for a longer surface to avoid
                diluting the three red-flag anchors. */}
            <div className="flex flex-col items-start gap-4 text-left">
              <div className="flex w-full flex-col items-center gap-2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning-surface text-warning">
                  <ShieldSvg size={24} />
                </div>
                <h2 className="text-lg font-bold text-text-primary">
                  Stop &amp; Seek Help
                </h2>
              </div>
              <div className="flex flex-col gap-3 text-sm leading-relaxed text-text-secondary">
                <div>
                  <p className="font-semibold text-warning">
                    Stop and call emergency services (911 / 999 / 112) for:
                  </p>
                  <ul className="mt-1 flex flex-col gap-1 pl-4">
                    <li className="list-disc">
                      Chest pain, fainting, or unusual breathlessness
                    </li>
                    <li className="list-disc">
                      Heat emergency: confusion, stopped sweating,
                      severe headache, or vomiting
                    </li>
                    <li className="list-disc">
                      A hard hit to the head, or feeling confused or
                      off-balance after one
                    </li>
                  </ul>
                </div>
                <p>
                  For pain that is persistent, worsening, or you&apos;re
                  unsure about, see a qualified clinician.
                </p>
              </div>
              <Button
                variant="soft"
                fullWidth
                className="mt-2"
                onClick={() => setOpen(false)}
              >
                Got it
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
