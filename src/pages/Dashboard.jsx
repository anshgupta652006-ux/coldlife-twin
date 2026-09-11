import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Clock3, Coins, Package, ShieldCheck, Truck } from 'lucide-react'
import Header from '../components/Header'
import KpiCard from '../components/KpiCard'
import FleetMap from '../components/FleetMap'
import ShipmentTwinPanel from '../components/ShipmentTwinPanel'
import TemperatureChart from '../components/TemperatureChart'
import RiskTrendChart from '../components/RiskTrendChart'
import CustodyTimeline from '../components/CustodyTimeline'
import VehicleHealthCard from '../components/VehicleHealthCard'
import DriverBehaviorCard from '../components/DriverBehaviorCard'
import AlertFeed from '../components/AlertFeed'
import CriticalCasesStrip, { isCriticalShipment } from '../components/CriticalCasesStrip'
import { getAlerts, getDashboard, getShipments, getStorages, tick } from '../api/coldlifeApi'

export default function Dashboard(){
  const nav=useNavigate()
  const [data,setData]=useState({dashboard:{},shipments:[],storages:[],alerts:[]})
  const [selected,setSelected]=useState('CLT-2403')
  const [paused,setPaused]=useState(false)
  const [loading,setLoading]=useState(true)
  const refresh=async()=>{try{const [dashboard,shipments,storages,alerts]=await Promise.all([getDashboard(),getShipments(),getStorages(),getAlerts()]);setData({dashboard,shipments,storages,alerts});if(!shipments.find(x=>x.id===selected)&&shipments[0])setSelected(shipments[0].id)}finally{setLoading(false)}}
  useEffect(()=>{refresh();const refreshId=setInterval(()=>!paused&&refresh(),5000);const tickId=setInterval(async()=>{if(!paused){await tick();await refresh()}},15000);const onRefresh=()=>refresh();window.addEventListener('coldlife-refresh',onRefresh);return()=>{clearInterval(refreshId);clearInterval(tickId);window.removeEventListener('coldlife-refresh',onRefresh)}},[paused])
  const s=data.shipments.find(x=>x.id===selected)||data.shipments[0]
  const criticalCount=useMemo(()=>data.shipments.filter(isCriticalShipment).length,[data.shipments])
  if(loading&&!s)return <div className="min-h-screen grid-bg flex items-center justify-center text-slate-400">Loading ColdLife Twin…</div>
  if(!s)return <div className="min-h-screen grid-bg flex items-center justify-center text-red-300">No shipment data available.</div>
  return <div className="min-h-screen grid-bg"><Header paused={paused} setPaused={setPaused} onTick={async()=>{await tick();await refresh()}}/><main className="mx-auto max-w-[1700px] p-5 lg:p-7"><div className="mb-6"><div className="text-xs font-bold uppercase tracking-[.22em] text-cyan-300">Operations / Live Twin</div><h1 className="mt-1 text-3xl font-extrabold">Fleet Command Centre</h1><p className="mt-2 max-w-2xl text-sm text-slate-500">Live pharmaceutical cold-chain telemetry, risk prediction and controlled intervention.</p></div><div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6"><KpiCard label="Active fleet" value={data.dashboard.activeFleet??data.shipments.length} sub="refrigerated vehicles" icon={Truck}/><KpiCard label="Active shipments" value={data.dashboard.activeShipments??data.shipments.length} sub="tracked digital twins" icon={Package}/><KpiCard label="Critical shipments" value={criticalCount} sub="requires intervention" icon={AlertTriangle}/><KpiCard label="Avg survival" value={`${data.dashboard.avgSurvival??0}%`} sub="predicted viability" icon={ShieldCheck}/><KpiCard label="On-time delivery" value={`${data.dashboard.onTime??0}%`} sub="current forecast" icon={Clock3}/><KpiCard label="Loss avoided" value={data.dashboard.lossAvoided??'₹0'} sub={`${data.dashboard.batchesSaved??0} batches saved`} icon={Coins}/></div><CriticalCasesStrip shipments={data.shipments} onSelect={setSelected}/><div className="grid gap-5 xl:grid-cols-[1.65fr_0.9fr]"><section className="glass rounded-2xl p-3"><div className="px-3 py-2"><div className="font-semibold">Live Fleet Map</div><div className="text-[10px] uppercase tracking-widest text-slate-500">Mumbai operations zone · live vehicles and cold hubs</div></div><FleetMap shipments={data.shipments} storages={data.storages} onSelect={setSelected}/></section><ShipmentTwinPanel s={s} onAccept={()=>nav(`/shipments/${s.id}`)}/></div><div className="mt-5 grid gap-5 lg:grid-cols-2"><div className="glass rounded-2xl p-5"><div className="font-semibold">Temperature trajectory</div><div className="text-xs text-slate-500">Live sensor signal · permitted range shaded</div><TemperatureChart data={s.tempHistory} safeMin={s.safeMin} safeMax={s.safeMax}/></div><div className="glass rounded-2xl p-5"><div className="font-semibold">Survival / risk trend</div><div className="text-xs text-slate-500">Product viability score</div><RiskTrendChart values={s.riskHistory}/></div></div><div className="mt-5 grid gap-5 lg:grid-cols-3"><div className="glass rounded-2xl p-5"><div className="mb-4 font-semibold">Chain of custody</div><CustodyTimeline events={s.events}/></div><VehicleHealthCard s={s}/><DriverBehaviorCard s={s}/></div><div className="mt-5 glass rounded-2xl p-5"><div className="mb-4 flex justify-between"><div><div className="font-semibold">Active alerts</div><div className="text-xs text-slate-500">Prioritised by operational impact</div></div><button onClick={()=>nav('/alerts')} className="text-xs text-cyan-300">View all →</button></div><AlertFeed alerts={data.alerts} onOpen={()=>{}}/></div></main></div>
}
