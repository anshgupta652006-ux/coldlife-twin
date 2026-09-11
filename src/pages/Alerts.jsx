import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getAlerts } from '../api/coldlifeApi'
import AlertFeed from '../components/AlertFeed'
export default function Alerts(){const nav=useNavigate();const [alerts,setAlerts]=useState([]);useEffect(()=>{getAlerts().then(setAlerts)},[]);return <div className="min-h-screen grid-bg p-5 lg:p-8"><main className="mx-auto max-w-5xl"><button onClick={()=>nav('/')} className="mb-5 flex items-center gap-2 text-xs text-slate-400"><ArrowLeft size={15}/> Back</button><div className="glass rounded-2xl p-6"><h1 className="text-2xl font-extrabold">AI Alert Feed</h1><p className="mt-1 text-sm text-slate-500">Operational cold-chain alerts from Supabase.</p><div className="mt-5"><AlertFeed alerts={alerts}/></div></div></main></div>}
