import { CartesianGrid, Line, LineChart, ReferenceArea, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
export default function TemperatureChart({data=[],safeMin=2,safeMax=8}){
  return <div className="h-64 w-full"><ResponsiveContainer><LineChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/><XAxis dataKey="time" hide/><YAxis domain={['auto','auto']} tick={{fill:'#64748b',fontSize:10}}/><Tooltip contentStyle={{background:'#0f172a',border:'1px solid #334155',borderRadius:10}}/><ReferenceArea y1={safeMin} y2={safeMax} fill="#22d3ee" fillOpacity={0.06}/><Line type="monotone" dataKey="temp" stroke="#22d3ee" strokeWidth={2} dot={false} isAnimationActive={false}/></LineChart></ResponsiveContainer></div>
}
