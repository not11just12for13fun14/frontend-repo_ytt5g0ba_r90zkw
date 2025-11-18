import { useState } from 'react'
import EmployeeList from './components/EmployeeList'
import AddEmployee from './components/AddEmployee'
import AttendancePanel from './components/AttendancePanel'
import AttendanceChart from './components/AttendanceChart'

function App() {
  const [selected, setSelected] = useState(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>

      <div className="relative min-h-screen p-6 md:p-10">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Attendance Manager</h1>
          <p className="text-blue-200">Mark presence by location, track history, search and manage employees.</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="space-y-6 lg:col-span-1">
            <AddEmployee onCreated={() => window.location.reload()} />
            <EmployeeList onSelect={(e)=>setSelected(e)} />
          </div>

          <div className="space-y-6 lg:col-span-2">
            <AttendancePanel selected={selected} />
            <AttendanceChart employee={selected} />
          </div>
        </div>

        <footer className="mt-10 text-center text-blue-300/60 text-sm">Set office coordinates using OFFICE_LAT, OFFICE_LNG and radius GEOFENCE_M env vars.</footer>
      </div>
    </div>
  )
}

export default App
