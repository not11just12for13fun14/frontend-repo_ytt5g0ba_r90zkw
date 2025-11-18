import { useEffect, useMemo, useState } from "react";

const API = import.meta.env.VITE_BACKEND_URL || "";

function toDateInputValue() {
  const d = new Date();
  const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function AttendancePanel({ selected }) {
  const [dateStr, setDateStr] = useState(toDateInputValue());
  const [daily, setDaily] = useState({ date: toDateInputValue(), records: [] });

  const fetchDaily = async () => {
    const res = await fetch(`${API}/attendance/daily?date_str=${dateStr}`);
    const data = await res.json();
    setDaily(data);
  };

  useEffect(() => { fetchDaily(); }, [dateStr]);

  const mark = async () => {
    if (!selected) return alert('Select an employee first');
    let lat = null, lng = null;
    try {
      const pos = await new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject));
      lat = pos.coords.latitude; lng = pos.coords.longitude;
    } catch (e) {
      // continue without location
    }
    const res = await fetch(`${API}/attendance/mark`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employee_id: selected.id, lat, lng })
    });
    await res.json();
    fetchDaily();
  };

  const presentToday = useMemo(() => daily.records.filter(r => r.status === 'present'), [daily]);

  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-white font-semibold">Daily Attendance</div>
          <div className="text-blue-200/70 text-sm">{daily.date}</div>
        </div>
        <input type="date" value={dateStr} onChange={(e)=>setDateStr(e.target.value)} className="px-3 py-2 bg-slate-900/60 text-white rounded-lg border border-slate-700"/>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={mark} className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg">Mark Present (Geo)</button>
        {selected && <div className="text-blue-200 text-sm">Selected: {selected.name}</div>}
      </div>

      <div>
        <div className="text-white mb-2">Present Today ({presentToday.length})</div>
        <div className="grid md:grid-cols-2 gap-2">
          {presentToday.map(r => (
            <div key={r.id} className="rounded-lg border border-slate-700 p-3 text-blue-100">
              <div className="font-medium">{r.employee_name || r.employee_id}</div>
              <div className="text-xs opacity-70">Distance: {r.distance_m ? r.distance_m.toFixed(1) + ' m' : 'n/a'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
