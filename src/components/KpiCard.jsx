export default function KpiCard({label,value,sub,icon:Icon}){
  return <div className="glass rounded-2xl p-4 min-h-[112px]">
    <div className="flex items-center justify-between gap-3"><div className="text-[10px] uppercase tracking-[.16em] font-bold text-slate-500">{label}</div>{Icon&&<Icon size={16} className="text-cyan-300"/>}</div>
    <div className="mt-3 text-2xl font-black text-slate-100">{value}</div>
    <div className="mt-1 text-[11px] text-slate-500">{sub}</div>
  </div>
}
