import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  Clock3,
  Fuel,
  MapPin,
  Package,
  Snowflake,
  Thermometer,
} from 'lucide-react'

const n = (v, fallback = 0) => {
  const x = Number(v)
  return Number.isFinite(x) ? x : fallback
}

function deriveCritical(s = {}) {
  const t = n(s.temperature ?? s.currentTemperature)
  const min = n(s.safeMin, 2)
  const max = n(s.safeMax, 8)
  const survival = n(s.survival ?? s.survivalScore, 95)
  const risk = String(s.riskLevel ?? '').toLowerCase()
  const op = String(s.shipmentStatus ?? s.operationalStatus ?? '').toLowerCase()

  return (
    op === 'quarantined' ||
    risk === 'critical' ||
    t >= max + 0.5 ||
    t <= min - 0.5 ||
    survival <= 70
  )
}

function initialEtaAt(s = {}) {
  for (const value of [s.etaAt, s.estimatedArrival]) {
    if (value) {
      const d = new Date(value)
      if (!Number.isNaN(d.getTime()) && d.getTime() > Date.now()) return d.getTime()
    }
  }

  if (Number.isFinite(Number(s.etaMinutes)) && Number(s.etaMinutes) > 0) {
    return Date.now() + Number(s.etaMinutes) * 60_000
  }

  // Demo fallback only when the backend does not provide ETA.
  return Date.now() + 35 * 60_000
}

export default function ShipmentTwinPanel({ s = {}, onAccept }) {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const etaAt = useMemo(
    () => initialEtaAt(s),
    [s?.id, s?.etaAt, s?.estimatedArrival, s?.etaMinutes]
  )

  const remainingMs = Math.max(0, etaAt - now)
  const etaMinutes = Math.max(0, Math.ceil(remainingMs / 60_000))
  const etaClock = new Date(etaAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
  const etaText = `${etaMinutes} min · ${etaClock}`

  const critical = deriveCritical(s)

  return (
    <section className={`glass rounded-2xl p-5 ${critical ? 'ring-1 ring-red-400/50' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[.18em] text-slate-500">
            {s.id || s.shipmentId || 'Shipment'}
          </div>
          <div className="mt-1 text-xl font-extrabold text-slate-100">
            {s.product || s.productName || 'Cold-chain shipment'}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {s.batch || 'Demo batch'} · {s.vehicleName || s.vehicle || 'Reefer vehicle'}
          </div>
        </div>

        <div className={`rounded-full px-3 py-1.5 text-xs font-black uppercase ${
          critical
            ? 'bg-red-500/15 text-red-300'
            : s.status === 'watch'
              ? 'bg-amber-400/15 text-amber-300'
              : s.status === 'rerouted'
                ? 'bg-purple-400/15 text-purple-300'
                : 'bg-emerald-400/15 text-emerald-300'
        }`}>
          {critical ? 'critical' : (s.status || 'safe')}
        </div>
      </div>

      {critical && (
        <div className="mt-4 flex gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-200">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <div>
            <div className="text-sm font-extrabold">Critical shipment intervention required</div>
            <div className="mt-1 text-xs leading-5 text-red-200/80">
              Critical is calculated locally from shipment status, risk, temperature and survival. Gemini is not involved.
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Metric icon={Clock3} label="Live ETA" value={etaText} />
        <Metric
          icon={MapPin}
          label="Remaining"
          value={s.remainingKm != null ? `${n(s.remainingKm).toFixed(1)} km` : 'Route calculating'}
        />
        <Metric
          icon={Thermometer}
          label="Temperature"
          value={`${n(s.temperature ?? s.currentTemperature).toFixed(1)}°C`}
          danger={critical}
        />
        <Metric
          icon={Package}
          label="Survival"
          value={`${n(s.survival ?? s.survivalScore).toFixed(0)}%`}
          danger={n(s.survival ?? s.survivalScore) <= 70}
        />
        <Metric
          icon={Fuel}
          label="Fuel"
          value={`${n(s.fuelLevelPct ?? s.fuelPct ?? s.fuel, 75).toFixed(1)}%`}
          danger={n(s.fuelLevelPct ?? s.fuelPct ?? s.fuel, 75) < 25}
        />
        <Metric
          icon={Snowflake}
          label="Cooling health"
          value={`${n(s.coolingHealthPct ?? s.coolingHealth ?? s.reeferHealth, 90).toFixed(0)}%`}
          danger={n(s.coolingHealthPct ?? s.coolingHealth ?? s.reeferHealth, 90) < 60}
        />
      </div>

      <div className="mt-4 rounded-xl border border-slate-700/50 bg-slate-950/30 p-3">
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Recommendation
        </div>
        <div className="mt-2 text-sm leading-6 text-slate-300">
          {s.recommendation || 'Continue monitoring.'}
        </div>
      </div>

      {onAccept && (
        <button
          type="button"
          onClick={() => onAccept(s.id || s.shipmentId)}
          className="mt-4 w-full rounded-xl bg-cyan-400/10 px-3 py-2.5 text-xs font-bold text-cyan-200 hover:bg-cyan-400/15"
        >
          Accept recommended action
        </button>
      )}
    </section>
  )
}

function Metric({ icon: Icon, label, value, danger = false }) {
  return (
    <div className={`rounded-xl border p-3 ${
      danger ? 'border-red-500/25 bg-red-500/5' : 'border-slate-700/50 bg-slate-950/30'
    }`}>
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
        <Icon size={13} />
        {label}
      </div>
      <div className={`mt-1.5 text-sm font-extrabold ${danger ? 'text-red-300' : 'text-slate-100'}`}>
        {value}
      </div>
    </div>
  )
}
