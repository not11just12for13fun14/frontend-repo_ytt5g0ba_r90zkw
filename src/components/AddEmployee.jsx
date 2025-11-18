import { useState } from "react";

const API = import.meta.env.VITE_BACKEND_URL || "";

export default function AddEmployee({ onCreated }) {
  const [form, setForm] = useState({ name: "", email: "", role: "", phone: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      await res.json();
      setForm({ name: "", email: "", role: "", phone: "" });
      onCreated?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <input value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} placeholder="Name" className="px-3 py-2 bg-slate-900/60 text-white rounded-lg border border-slate-700" required/>
        <input type="email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} placeholder="Email" className="px-3 py-2 bg-slate-900/60 text-white rounded-lg border border-slate-700" required/>
        <input value={form.role} onChange={(e)=>setForm({...form, role:e.target.value})} placeholder="Role" className="px-3 py-2 bg-slate-900/60 text-white rounded-lg border border-slate-700"/>
        <input value={form.phone} onChange={(e)=>setForm({...form, phone:e.target.value})} placeholder="Phone" className="px-3 py-2 bg-slate-900/60 text-white rounded-lg border border-slate-700"/>
      </div>
      <button disabled={loading} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg disabled:opacity-60">{loading ? 'Adding...' : 'Add Employee'}</button>
    </form>
  );
}
