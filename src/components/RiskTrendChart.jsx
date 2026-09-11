import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
export default function RiskTrendChart({values=[]}){
  const data=values.map((v,i)=>({i,value:Number(v)}))
  return <div className="h-64 w-full"><ResponsiveContainer><LineChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/><XAxis dataKey="i" hide/><YAxis domain={[0,100]} tick={{fill:'#64748b',fontSize:10}}/><Tooltip contentStyle={{background:'#0f172a',border:'1px solid #334155',borderRadius:10}}/><Line type="monotone" dataKey="value" stroke="#a78bfa" strokeWidth={2} dot={false} isAnimationActive={false}/></LineChart></ResponsiveContainer></div>
}
