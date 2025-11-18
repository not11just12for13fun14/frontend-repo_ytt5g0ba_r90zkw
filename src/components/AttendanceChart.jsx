import { useEffect, useMemo, useState } from "react";

const API = import.meta.env.VITE_BACKEND_URL || "";

export default function AttendanceChart({ employee }) {
  const [range, setRange] = useState({ start: "", end: "" });
  const [data, setData] = useState({ present: 0, absent: 0, series: [] });

  const fetchSummary = async () => {
    if (!employee) return;
    const params = new URLSearchParams();
    if (range.start && range.end) { params.set('start', range.start); params.set('end', range.end); }
    const res = await fetch(`${API}/attendance/summary/${employee.id}?${params.toString()}`);
    const d = await res.json();
    setData(d);
  };

  useEffect(() => { fetchSummary(); }, [employee?.id, range.start, range.end]);

  const total = data.present + data.absent;
  const pct = total ? Math.round((data.present / total) * 100) : 0;

  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-white font-semibold">Attendance Summary</div>
          {employee ? (
            <div className="text-blue-200/70 text-sm">{employee.name}</div>
          ) : (
            <div className="text-blue-200/60 text-sm">Select an employee to see charts</div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <input type="date" value={range.start} onChange={e=>setRange({...range, start: e.target.value})} className="px-3 py-2 bg-slate-900/60 text-white rounded-lg border border-slate-700"/>
          <span className="text-blue-200">to</span>
          <input type="date" value={range.end} onChange={e=>setRange({...range, end: e.target.value})} className="px-3 py-2 bg-slate-900/60 text-white rounded-lg border border-slate-700"/>
        </div>
      </div>

      {employee && (
        <div className="grid md:grid-cols-3 gap-4 items-end">
          <div className="col-span-1">
            <div className="text-blue-200 text-sm mb-1">Present</div>
            <div className="h-24 bg-emerald-600/30 border border-emerald-600 rounded-lg flex items-end">
              <div style={{height: `${total ? (data.present/total)*100 : 0}%`}} className="w-full bg-emerald-500 rounded-b-lg transition-all"></div>
            </div>
            <div className="text-white font-medium mt-1">{data.present}</div>
          </div>
          <div className="col-span-1">
            <div className="text-blue-200 text-sm mb-1">Absent</div>
            <div className="h-24 bg-rose-600/30 border border-rose-600 rounded-lg flex items-end">
              <div style={{height: `${total ? (data.absent/total)*100 : 0}%`}} className="w-full bg-rose-500 rounded-b-lg transition-all"></div>
            </div>
            <div className="text-white font-medium mt-1">{data.absent}</div>
          </div>
          <div className="col-span-1">
            <div className="text-blue-200 text-sm">Presence Rate</div>
            <div className="text-4xl font-bold text-white">{pct}%</div>
          </div>
        </div>
      )}

      {employee && data.series.length > 0 && (
        <div className="mt-4">
          <div className="text-blue-200 text-sm mb-2">By Day</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {data.series.map(s => (
              <div key={s.date} className="rounded-lg border border-slate-700 p-2 text-blue-100">
                <div className="text-sm font-medium">{s.date}</div>
                <div className="text-xs">P: {s.present} | A: {s.absent}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
