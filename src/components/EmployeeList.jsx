import { useEffect, useMemo, useState } from "react";

const API = import.meta.env.VITE_BACKEND_URL || "";

export default function EmployeeList({ onSelect }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const fetchEmployees = async (query = "") => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/employees${query ? `?q=${encodeURIComponent(query)}` : ""}`);
      const data = await res.json();
      setEmployees(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filtered = useMemo(() => employees, [employees]);

  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or email"
          className="w-full px-3 py-2 bg-slate-900/60 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => fetchEmployees(q)}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
        >Search</button>
      </div>

      {loading ? (
        <div className="text-blue-200">Loading...</div>
      ) : (
        <ul className="divide-y divide-slate-700">
          {filtered.map(emp => (
            <li key={emp.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="text-white font-medium">{emp.name}</div>
                <div className="text-blue-200/70 text-sm">{emp.email}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelect?.(emp)}
                  className="px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded-md"
                >Select</button>
                <button
                  onClick={async () => {
                    if (!confirm(`Remove ${emp.name}?`)) return;
                    await fetch(`${API}/employees/${emp.id}`, { method: 'DELETE' });
                    fetchEmployees(q);
                  }}
                  className="px-3 py-1.5 text-xs bg-rose-600 hover:bg-rose-500 text-white rounded-md"
                >Remove</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
