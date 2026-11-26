"use client"

import * as React from "react"
import { Printer } from "lucide-react"
import { cn } from "@/lib/utils"

const INKS = [
  { name: "אדום", value: "#C2271D" },
  { name: "כחול", value: "#1F4E9C" },
  { name: "ירוק", value: "#1E7A4C" },
  { name: "כתום", value: "#D9641A" },
  { name: "סגול", value: "#6B2E8F" },
  { name: "זהב", value: "#B8860B" },
  { name: "שחור", value: "#141C26" },
]

const PAPERS = [
  { name: "קרם", value: "#F4ECD8" },
  { name: "לבן", value: "#FFFFFF" },
  { name: "צהוב", value: "#F6D44A" },
  { name: "ורוד", value: "#F6C9C4" },
  { name: "תכלת", value: "#CFE3EE" },
  { name: "ירוק בהיר", value: "#D4E8C8" },
]

type Swatch = { name: string; value: string }

function Swatches({ legend, items, value, onChange }: { legend: string; items: Swatch[]; value: Swatch; onChange: (s: Swatch) => void }) {
  return (
    <fieldset className="mt-6">
      <legend className="kicker mb-3">{legend}</legend>
      <div className="flex flex-wrap gap-3">
        {items.map((s) => (
          <label key={s.value} title={s.name} className="cursor-pointer">
            <input type="radio" className="peer sr-only" checked={s.value === value.value} onChange={() => onChange(s)} />
            <span
              className="block size-8 rounded-full ring-1 ring-white/25 transition peer-checked:ring-2 peer-checked:ring-tint peer-checked:ring-offset-2 peer-checked:ring-offset-background peer-focus-visible:outline peer-focus-visible:outline-tint"
              style={{ background: s.value }}
            />
            <span className="sr-only">{s.name}</span>
          </label>
        ))}
      </div>
      <p className="mt-2 text-sm text-muted" aria-live="polite">
        נבחר: <span className="text-foreground">{value.name}</span>
      </p>
    </fieldset>
  )
}

/* Type a headline, pick ink and paper, and "print" a poster like the ones at the Mlan press. */
export function PosterPress() {
  const [draft, setDraft] = React.useState("מל״ן")
  const [title, setTitle] = React.useState("מל״ן")
  const [ink, setInk] = React.useState(INKS[0])
  const [paper, setPaper] = React.useState(PAPERS[0])
  const [hit, setHit] = React.useState(0)

  const print = () => {
    setTitle(draft.trim() || "מל״ן")
    setHit((h) => h + 1)
  }

  return (
    <div className="grid items-center gap-10 md:grid-cols-2 [&>*]:min-w-0">
      <div>
        <p className="kicker">מכבש</p>
        <h2 className="mt-2 font-head text-3xl md:text-4xl">הדפס כרוז משלך</h2>
        <p className="mt-4 text-lg leading-relaxed text-foreground/85">
          משה הדפיס כרוזים לקהילה ולמחתרות. כתבו כותרת, בחרו צבעים והדפיסו אותה כמו בדפוס מל״ן.
        </p>
        <div className="mt-6 flex gap-3">
          <input
            value={draft}
            maxLength={22}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && print()}
            aria-label="כותרת הכרוז"
            className="glass min-w-0 flex-1 rounded-md px-4 py-3 text-lg text-foreground outline-none focus-visible:ring-2 focus-visible:ring-tint"
          />
          <button
            type="button"
            onClick={print}
            className="inline-flex items-center gap-2 rounded-md bg-tint px-5 py-3 font-head text-ink transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tint"
          >
            <Printer className="size-5" aria-hidden />
            הדפס
          </button>
        </div>
        <Swatches legend="צבע הכותרת" items={INKS} value={ink} onChange={(s) => { setInk(s); setHit((h) => h + 1) }} />
        <Swatches legend="צבע הנייר" items={PAPERS} value={paper} onChange={(s) => { setPaper(s); setHit((h) => h + 1) }} />
      </div>

      <div className="flex justify-center">
        <div
          key={hit}
          aria-live="polite"
          className={cn(
            "flex aspect-[3/4] w-full max-w-sm -rotate-2 flex-col items-center justify-between rounded-[2px] p-8 text-center text-ink",
            "shadow-[0_0_0_1px_rgba(10,40,50,.16),0_30px_60px_-20px_rgba(0,0,0,.8)]",
            hit > 0 && "motion-safe:animate-[press_.5s_cubic-bezier(.2,.8,.2,1)]",
          )}
          style={{ background: paper.value }}
        >
          <small className="text-xs tracking-[0.3em] opacity-70">דפוס מל״ן, תל אביב</small>
          <div className="font-head text-6xl leading-tight break-words md:text-7xl" style={{ color: ink.value, maxWidth: "100%" }}>
            {title}
          </div>
          <small className="text-xs tracking-[0.3em] opacity-70">הלל הזקן 6</small>
        </div>
      </div>
      <style>{"@keyframes press{0%{transform:rotate(-2deg) scale(1.06) translateY(-14px);filter:blur(1px)}60%{transform:rotate(-2deg) scale(.985)}100%{transform:rotate(-2deg) scale(1)}}"}</style>
    </div>
  )
}
