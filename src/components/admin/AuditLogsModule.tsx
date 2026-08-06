import React from 'react';
import { ShieldAlert, Download, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { exportAuditLogsReport, exportAuditLogsReportPDF } from '../../utils/reportExporter';

export const AuditLogsModule: React.FC = () => {
  const { auditLogs } = useApp();

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900/80 p-6 rounded-2xl border border-amber-500/30">
        <div>
          <h2 className="font-serif text-2xl font-bold text-amber-100 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-amber-400" />
            <span>Security Audit Trail & System Logs</span>
          </h2>
          <p className="text-xs text-zinc-400">
            Immutable log of all user activities, ERP modifications, sales entries, and warranty status changes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => exportAuditLogsReportPDF(auditLogs)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>Download PDF Report</span>
          </button>
          <button
            onClick={() => exportAuditLogsReport(auditLogs)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>CSV</span>
          </button>


        </div>
      </div>

      <div className="bg-zinc-900/80 rounded-2xl border border-zinc-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950 text-amber-400 uppercase font-mono border-b border-zinc-800">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Staff User</th>
                <th className="p-3">Role</th>
                <th className="p-3">Module</th>
                <th className="p-3">Action</th>
                <th className="p-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono">
              {auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-zinc-800/40">
                  <td className="p-3 text-zinc-500">{log.timestamp}</td>
                  <td className="p-3 font-sans font-bold text-zinc-100">{log.userName}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px]">
                      {log.userRole}
                    </span>
                  </td>
                  <td className="p-3 text-zinc-400">{log.module}</td>
                  <td className="p-3 font-bold text-amber-200">{log.action}</td>
                  <td className="p-3 font-sans text-zinc-300">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
