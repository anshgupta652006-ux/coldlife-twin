import { CheckCircle2, CircleDot, Clock3, MapPin, ShieldAlert } from 'lucide-react'

function validDate(value) {
  if (!value) return null
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

function getTime(event, index, total) {
  const d =
    validDate(event?.recorded_at) ||
    validDate(event?.occurred_at) ||
    validDate(event?.timestamp) ||
    validDate(event?.created_at) ||
    validDate(event?.recordedAt) ||
    validDate(event?.occurredAt)

  if (d) {
    return d.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const existing = String(event?.time ?? '').trim()
  if (existing && existing !== '—' && existing.toLowerCase() !== 'undefined') {
    return existing
  }

  const fallback = new Date(Date.now() - Math.max(0, total - 1 - index) * 15 * 60_000)
  return fallback.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getStatus(event) {
  const status = String(event?.status || '').toLowerCase()
  const type = String(event?.event_type || '').toLowerCase()

  if (status === 'critical' || type.includes('critical') || type.includes('alert')) return 'critical'
  if (status === 'active' || status === 'current') return 'active'
  return 'complete'
}

export default function CustodyTimeline({ events = [] }) {
  const all = Array.isArray(events) ? events : []

  // Keep the card short: show only the three newest/relevant custody events.
  const rows = all.slice(-3)

  if (!rows.length) {
    return (
      <div className="py-3 text-xs text-slate-500">
        No custody events yet.
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {rows.map((event, index) => {
        const status = getStatus(event)
        const time = getTime(event, index, rows.length)
        const title =
          event.title ||
          event.label ||
          event.event_type ||
          'Custody event'
        const location = event.location || event.location_name || ''

        const Icon =
          status === 'critical'
            ? ShieldAlert
            : status === 'active'
              ? CircleDot
              : CheckCircle2

        return (
          <div
            key={event.id || `${title}-${index}`}
            className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${
              status === 'critical'
                ? 'border-red-500/25 bg-red-500/7'
                : 'border-slate-700/40 bg-slate-950/20'
            }`}
          >
            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
              status === 'critical'
                ? 'bg-red-500/15 text-red-300'
                : status === 'active'
                  ? 'bg-cyan-400/10 text-cyan-300'
                  : 'bg-emerald-400/10 text-emerald-300'
            }`}>
              <Icon size={14} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-semibold text-slate-200">
                {title}
              </div>
              {location && (
                <div className="mt-0.5 flex items-center gap-1 truncate text-[10px] text-slate-500">
                  <MapPin size={10} />
                  {location}
                </div>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-1 rounded-lg bg-slate-900/70 px-2 py-1 font-mono text-[10px] text-cyan-200">
              <Clock3 size={10} />
              {time}
            </div>
          </div>
        )
      })}
    </div>
  )
}
