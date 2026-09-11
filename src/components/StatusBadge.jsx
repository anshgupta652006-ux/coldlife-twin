import { AlertTriangle, CircleCheck, Route, ShieldAlert } from 'lucide-react'

function n(v, fallback = 0) {
  const x = Number(v)
  return Number.isFinite(x) ? x : fallback
}

export function deriveDisplayStatus(shipment = {}, explicitStatus) {
  const raw = String(
    explicitStatus ??
    shipment.status ??
    shipment.shipmentStatus ??
    shipment.operationalStatus ??
    ''
  ).toLowerCase()

  const risk = String(shipment.riskLevel ?? shipment.risk_level ?? '').toLowerCase()
  const temp = n(shipment.temperature ?? shipment.currentTemperature ?? shipment.current_temp_c)
  const safeMin = n(shipment.safeMin ?? shipment.target_temp_min_c, 2)
  const safeMax = n(shipment.safeMax ?? shipment.target_temp_max_c, 8)
  const survival = n(shipment.survival ?? shipment.survivalScore ?? shipment.survival_score, 95)

  if (
    raw === 'critical' ||
    raw === 'quarantined' ||
    risk === 'critical' ||
    temp >= safeMax + 0.5 ||
    temp <= safeMin - 0.5 ||
    survival <= 70
  ) return 'critical'

  if (
    raw === 'watch' ||
    raw === 'delayed' ||
    risk === 'high' ||
    risk === 'medium' ||
    temp > safeMax ||
    temp < safeMin ||
    survival < 90
  ) return 'watch'

  if (
    raw === 'rerouted' ||
    String(shipment.priority || '').toLowerCase() === 'critical'
  ) return 'rerouted'

  return 'safe'
}

export default function StatusBadge({ status, shipment }) {
  const value = deriveDisplayStatus(shipment || {}, status)

  const config = {
    critical: {
      label: 'CRITICAL',
      icon: ShieldAlert,
      classes: 'border-red-400/40 bg-red-500/15 text-red-200 shadow-[0_0_28px_rgba(239,68,68,.18)]',
      dot: 'bg-red-400 animate-pulse',
    },
    watch: {
      label: 'WATCH',
      icon: AlertTriangle,
      classes: 'border-amber-400/30 bg-amber-400/10 text-amber-200',
      dot: 'bg-amber-300',
    },
    rerouted: {
      label: 'PRIORITY',
      icon: Route,
      classes: 'border-purple-400/30 bg-purple-400/10 text-purple-200',
      dot: 'bg-purple-300',
    },
    safe: {
      label: 'SAFE',
      icon: CircleCheck,
      classes: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
      dot: 'bg-emerald-300',
    },
  }

  const c = config[value] || config.safe
  const Icon = c.icon

  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-black tracking-wider ${c.classes}`}>
      <span className={`h-2 w-2 rounded-full ${c.dot}`} />
      <Icon size={14} />
      {c.label}
    </div>
  )
}
