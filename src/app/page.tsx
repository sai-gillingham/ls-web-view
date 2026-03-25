"use client";

import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/status-badge";
import { PageHeader } from "@/components/page-header";
import { Server, Clock, Hash } from "lucide-react";

interface HealthData {
  services: Record<string, string>;
  edition: string;
  version: string;
}

interface InfoData {
  version: string;
  edition: string;
  session_id: string;
  system: string;
  is_docker: boolean;
  uptime: number;
}

export default function Dashboard() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [info, setInfo] = useState<InfoData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [healthRes, infoRes] = await Promise.all([
          fetch("/api/health"),
          fetch("/api/info"),
        ]);
        if (healthRes.ok) setHealth(await healthRes.json());
        if (infoRes.ok) setInfo(await infoRes.json());
      } catch (err: any) {
        setError("Unable to connect to LocalStack. Make sure it is running on port 4566.");
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <div>
      <PageHeader title="Dashboard" description="LocalStack service overview" />

      {error && (
        <div className="m-6 p-4 rounded-lg border" style={{ borderColor: "var(--error)", background: "rgba(239, 68, 68, 0.1)" }}>
          <p style={{ color: "var(--error)" }}>{error}</p>
        </div>
      )}

      {info && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
          <div className="rounded-lg border p-4" style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}>
            <div className="flex items-center gap-2 mb-2" style={{ color: "var(--text-secondary)" }}>
              <Server className="w-4 h-4" />
              <span className="text-xs font-medium uppercase">Version</span>
            </div>
            <p className="text-lg font-semibold">{info.version}</p>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{info.edition}</p>
          </div>
          <div className="rounded-lg border p-4" style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}>
            <div className="flex items-center gap-2 mb-2" style={{ color: "var(--text-secondary)" }}>
              <Clock className="w-4 h-4" />
              <span className="text-xs font-medium uppercase">Uptime</span>
            </div>
            <p className="text-lg font-semibold">{formatUptime(info.uptime)}</p>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{info.is_docker ? "Docker" : "Host"}</p>
          </div>
          <div className="rounded-lg border p-4" style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}>
            <div className="flex items-center gap-2 mb-2" style={{ color: "var(--text-secondary)" }}>
              <Hash className="w-4 h-4" />
              <span className="text-xs font-medium uppercase">Session</span>
            </div>
            <p className="text-sm font-mono truncate">{info.session_id}</p>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{info.system}</p>
          </div>
        </div>
      )}

      {health && (
        <div className="px-6 pb-6">
          <h2 className="text-lg font-semibold mb-4">Services</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(health.services)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([name, status]) => (
                <div
                  key={name}
                  className="rounded-lg border p-3 flex items-center justify-between"
                  style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
                >
                  <span className="text-sm font-medium">{name}</span>
                  <StatusBadge status={status} />
                </div>
              ))}
          </div>
        </div>
      )}

      {!health && !error && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse" style={{ color: "var(--text-secondary)" }}>
            Connecting to LocalStack...
          </div>
        </div>
      )}
    </div>
  );
}
