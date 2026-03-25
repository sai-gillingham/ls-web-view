"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { FunctionSquare, RefreshCw, Clock, MemoryStick } from "lucide-react";

interface LambdaFunction {
  FunctionName: string;
  Runtime: string;
  Handler: string;
  CodeSize: number;
  MemorySize: number;
  Timeout: number;
  LastModified: string;
  Description: string;
}

export default function LambdaPage() {
  const [functions, setFunctions] = useState<LambdaFunction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFunctions();
  }, []);

  const fetchFunctions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/lambda/functions");
      const data = await res.json();
      setFunctions(data.functions ?? []);
    } catch {}
    setLoading(false);
  };

  return (
    <div>
      <PageHeader title="Lambda Functions" description="Serverless Compute">
        <button
          onClick={fetchFunctions}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm border"
          style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </PageHeader>

      <div className="p-6">
        {loading && <div className="animate-pulse" style={{ color: "var(--text-secondary)" }}>Loading...</div>}
        {!loading && functions.length === 0 && (
          <div className="text-center py-12" style={{ color: "var(--text-secondary)" }}>
            No Lambda functions found
          </div>
        )}
        {functions.length > 0 && (
          <div className="grid gap-3">
            {functions.map((fn) => (
              <div
                key={fn.FunctionName}
                className="rounded-lg border p-4"
                style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <FunctionSquare className="w-5 h-5" style={{ color: "var(--accent)" }} />
                  <span className="font-semibold">{fn.FunctionName}</span>
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: "var(--bg-tertiary)", color: "var(--text-secondary)" }}>
                    {fn.Runtime}
                  </span>
                </div>
                {fn.Description && (
                  <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>{fn.Description}</p>
                )}
                <div className="flex gap-6 text-xs" style={{ color: "var(--text-secondary)" }}>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Timeout: {fn.Timeout}s
                  </span>
                  <span className="flex items-center gap-1">
                    <MemoryStick className="w-3 h-3" /> Memory: {fn.MemorySize}MB
                  </span>
                  <span>Handler: {fn.Handler}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
