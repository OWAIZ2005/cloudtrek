"use client";

import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const NAVY = "#173b70";
const RED = "#c43b43";
const PALETTE = ["#173b70", "#c43b43", "#6a8bb8", "#20242b", "#b7c6dc", "#8d97a8", "#3d5f94", "#e6a5a9"];

export function MonthlyChart({ data }: { data: { month: string; enquiries: number }[] }) {
  return (
    <div className="h-64" role="img" aria-label={`Monthly enquiries: ${data.map((d) => `${d.month} ${d.enquiries}`).join(", ")}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e9eaec" vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#5b6270" }} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#5b6270" }} />
          <Tooltip cursor={{ fill: "#f7f7f5" }} contentStyle={{ border: "1px solid #e9eaec", borderRadius: 0, fontSize: 12 }} />
          <Bar dataKey="enquiries" name="Enquiries" fill={NAVY} radius={0} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const STATUS_LABEL: Record<string, string> = {
  new: "New", contacted: "Contacted", quotation_sent: "Quotation Sent", approved: "Approved", completed: "Completed", cancelled: "Cancelled",
};

export function StatusChart({ data }: { data: { status: string; count: number }[] }) {
  const rows = data.map((d) => ({ name: STATUS_LABEL[d.status] ?? d.status, value: d.count }));
  const total = rows.reduce((s, r) => s + r.value, 0);
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="h-44 w-44 shrink-0" role="img" aria-label={`Enquiry status distribution: ${rows.map((r) => `${r.name} ${r.value}`).join(", ")}`}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={rows} dataKey="value" nameKey="name" innerRadius={52} outerRadius={84} paddingAngle={1} stroke="#fff" strokeWidth={2}>
              {rows.map((_, i) => (<Cell key={i} fill={PALETTE[i % PALETTE.length]} />))}
            </Pie>
            <Tooltip contentStyle={{ border: "1px solid #e9eaec", borderRadius: 0, fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="w-full space-y-2 text-sm">
        {rows.map((r, i) => (
          <li key={r.name} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2"><span className="size-2.5" style={{ background: PALETTE[i % PALETTE.length] }} aria-hidden />{r.name}</span>
            <span className="tabular-nums text-charcoal/80">{r.value}{total ? <span className="text-muted-foreground"> · {Math.round((r.value / total) * 100)}%</span> : null}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CategoryChart({ data }: { data: { name: string; count: number }[] }) {
  return (
    <div style={{ height: Math.max(180, data.length * 34) }} role="img" aria-label={`Products per category: ${data.map((d) => `${d.name} ${d.count}`).join(", ")}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
          <XAxis type="number" allowDecimals={false} hide />
          <YAxis type="category" dataKey="name" width={140} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#20242b" }} />
          <Tooltip cursor={{ fill: "#f7f7f5" }} contentStyle={{ border: "1px solid #e9eaec", borderRadius: 0, fontSize: 12 }} />
          <Bar dataKey="count" name="Products" fill={RED} radius={0} barSize={14} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
