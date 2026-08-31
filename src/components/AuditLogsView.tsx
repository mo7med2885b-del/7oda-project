import React from 'react';
import { useClinic } from '../context/ClinicContext';
import { ShieldCheck, Lock } from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const { auditLogs } = useClinic();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-6 rounded-2xl dark:bg-[#00182e]/80 bg-white border dark:border-[#00d9ff]/15 border-slate-200 shadow-xl backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-black tracking-tight dark:text-white text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#00d9ff]" />
            Audit Security Logs & RLS Compliance
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Immutable audit record of all patient data modifications, financial postings & system actions.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5" /> Supabase RLS Protected
        </span>
      </div>

      <div className="p-6 rounded-2xl dark:bg-[#00182e]/80 bg-white border dark:border-[#00d9ff]/15 border-slate-200 shadow-xl overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b dark:border-[#00d9ff]/15 border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-3">Timestamp</th>
              <th className="py-3 px-3">Role</th>
              <th className="py-3 px-3">Action</th>
              <th className="py-3 px-3">Entity Type</th>
              <th className="py-3 px-3">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-slate-800/60 divide-slate-100 text-xs">
            {auditLogs.map(log => (
              <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-[#00284c]/50 transition">
                <td className="py-3 px-3 font-mono text-[#00d9ff]">
                  {log.timestamp.replace('T', ' ').slice(0, 19)}
                </td>
                <td className="py-3 px-3 font-bold dark:text-white text-slate-900">
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#00101f] border border-slate-200 dark:border-[#00d9ff]/20 font-mono text-[10px]">
                    {log.user_role}
                  </span>
                </td>
                <td className="py-3 px-3 font-bold text-emerald-500">{log.action}</td>
                <td className="py-3 px-3 text-slate-400 font-mono">{log.entity_type}</td>
                <td className="py-3 px-3 font-mono text-slate-400 max-w-[300px] truncate">
                  {log.details ? JSON.stringify(log.details) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
