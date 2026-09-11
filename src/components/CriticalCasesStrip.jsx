import { AlertTriangle } from 'lucide-react'

function n(v, fallback = 0) {
  const x = Number(v)
  return Number.isFinite(x) ? x : fallback
}

export function isCriticalShipment(s = {}) {
  const temp = n(s.temperature ?? s.currentTemperature)
  const safeMin = n(s.safeMin, 2)
  const safeMax = n(s.safeMax, 8)
  const survival = n(s.survival ?? s.survivalScore, 95)
  const risk = String(s.riskLevel ?? '').toLowerCase()
  const operational = String(s.shipmentStatus ?? s.operationalStatus ?? '').toLowerCase()

  return (
    s.status === 'critical' ||
    operational === 'quarantined' ||
    risk === 'critical' ||
    temp >= safeMax + 0.5 ||
    temp <= safeMin - 0.5 ||
    survival <= 70
  )
}

export default function CriticalCasesStrip({ shipments = [], onSelect }) {
  const critical = shipments.filter(isCriticalShipment)

  if (!critical.length) {
    return (
      <div className="mb-5 rounded-2xl border border-slate-700/40 bg-slate-950/20 px-4 py-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <AlertTriangle size={14} />
          No critical shipments detected from the current live shipment data.
        </div>
      </div>
    )
  }

  return (
    <div className="mb-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-extrabold text-red-200">
            Critical cases requiring intervention
          </div>
          <div className="mt-0.5 text-[10px] text-red-200/60">
            Derived directly from live temperature, survival, risk and quarantine state
          </div>
        </div>

        <div className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-black text-red-200">
          {critical.length} CRITICAL
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {critical.map((s) => (
          <button
            key={s.id || s.shipmentId}
            type="button"
            onClick={() => onSelect?.(s.id || s.shipmentId)}
            className="rounded-xl border border-red-400/25 bg-slate-950/30 px-3 py-2 text-left transition hover:bg-red-500/10"
          >
            <div className="text-xs font-black text-red-200">
              {s.id || s.shipmentId}
            </div>
            <div className="mt-0.5 text-[10px] text-slate-400">
              {s.product || s.productName} · {n(s.temperature).toFixed(1)}°C · {n(s.survival).toFixed(0)}% survival
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
