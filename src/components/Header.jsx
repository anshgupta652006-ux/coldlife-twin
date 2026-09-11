import { Activity, Pause, Play, RotateCw } from 'lucide-react'
export default function Header({paused,setPaused,onTick}){
  return <header className="sticky top-0 z-[3000] border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
    <div className="mx-auto flex max-w-[1700px] items-center justify-between gap-3 px-5 py-3 lg:px-7">
      <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300"><Activity size={19}/></div><div><div className="font-black tracking-tight">ColdLife Twin</div><div className="text-[10px] uppercase tracking-widest text-slate-500">AI cold-chain command centre</div></div></div>
      <div className="flex gap-2"><button onClick={()=>setPaused?.(!paused)} className="rounded-xl border border-slate-700 px-3 py-2 text-xs text-slate-300">{paused?<Play size={14}/>:<Pause size={14}/>}</button><button onClick={onTick} className="flex items-center gap-2 rounded-xl bg-cyan-400/10 px-3 py-2 text-xs font-bold text-cyan-200"><RotateCw size={14}/> Tick</button></div>
    </div>
  </header>
}
