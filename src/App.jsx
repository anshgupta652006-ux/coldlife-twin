import { Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import ShipmentDetail from './pages/ShipmentDetail'
import Alerts from './pages/Alerts'

export default function App(){
  return <Routes>
    <Route path="/" element={<Dashboard/>}/>
    <Route path="/shipments/:id" element={<ShipmentDetail/>}/>
    <Route path="/alerts" element={<Alerts/>}/>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes>
}
