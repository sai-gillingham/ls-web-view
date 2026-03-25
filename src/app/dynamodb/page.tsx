"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Database, RefreshCw, Table } from "lucide-react";

export default function DynamoDBPage() {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableInfo, setTableInfo] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTables();
  }, []);

  useEffect(() => {
    if (selectedTable) {
      fetchTableInfo(selectedTable);
      fetchTableItems(selectedTable);
    }
  }, [selectedTable]);

  const fetchTables = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dynamodb/tables");
      const data = await res.json();
      setTables(data.tables ?? []);
    } catch {}
    setLoading(false);
  };

  const fetchTableInfo = async (table: string) => {
    try {
      const res = await fetch(`/api/dynamodb/tables/${table}`);
      const data = await res.json();
      setTableInfo(data.table);
    } catch {}
  };

  const fetchTableItems = async (table: string) => {
    try {
      const res = await fetch(`/api/dynamodb/tables/${table}?action=scan`);
      const data = await res.json();
      setItems(data.items ?? []);
    } catch {}
  };

  const flattenDDBItem = (item: any) => {
    const flat: Record<string, string> = {};
    for (const [key, val] of Object.entries(item)) {
      const typedVal = val as any;
      if (typedVal.S) flat[key] = typedVal.S;
      else if (typedVal.N) flat[key] = typedVal.N;
      else if (typedVal.BOOL !== undefined) flat[key] = String(typedVal.BOOL);
      else flat[key] = JSON.stringify(typedVal);
    }
    return flat;
  };

  const allKeys = items.length > 0
    ? [...new Set(items.flatMap((item) => Object.keys(item)))]
    : [];

  return (
    <div>
      <PageHeader title="DynamoDB Tables" description="NoSQL Database Service">
        <button
          onClick={fetchTables}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm border"
          style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </PageHeader>

      <div className="flex h-[calc(100vh-73px)]">
        <div className="w-72 border-r overflow-y-auto p-3" style={{ borderColor: "var(--border)" }}>
          <div className="text-xs font-semibold uppercase mb-2" style={{ color: "var(--text-secondary)" }}>
            Tables ({tables.length})
          </div>
          {loading && <div className="text-sm animate-pulse" style={{ color: "var(--text-secondary)" }}>Loading...</div>}
          {tables.map((table) => (
            <button
              key={table}
              onClick={() => setSelectedTable(table)}
              className="w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-2 mb-1"
              style={{
                background: selectedTable === table ? "var(--bg-tertiary)" : "transparent",
                color: selectedTable === table ? "var(--text-primary)" : "var(--text-secondary)",
              }}
            >
              <Table className="w-4 h-4 shrink-0" />
              <span className="truncate">{table}</span>
            </button>
          ))}
          {!loading && tables.length === 0 && (
            <p className="text-sm px-3" style={{ color: "var(--text-secondary)" }}>No tables found</p>
          )}
        </div>

        <div className="flex-1 overflow-auto p-4">
          {!selectedTable && (
            <div className="flex items-center justify-center h-full" style={{ color: "var(--text-secondary)" }}>
              Select a table to view items
            </div>
          )}
          {selectedTable && tableInfo && (
            <div className="mb-4 grid grid-cols-3 gap-4">
              <div className="rounded-lg border p-3" style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}>
                <div className="text-xs" style={{ color: "var(--text-secondary)" }}>Item Count</div>
                <div className="text-lg font-semibold">{tableInfo.ItemCount ?? 0}</div>
              </div>
              <div className="rounded-lg border p-3" style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}>
                <div className="text-xs" style={{ color: "var(--text-secondary)" }}>Status</div>
                <div className="text-lg font-semibold">{tableInfo.TableStatus}</div>
              </div>
              <div className="rounded-lg border p-3" style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}>
                <div className="text-xs" style={{ color: "var(--text-secondary)" }}>Size (bytes)</div>
                <div className="text-lg font-semibold">{tableInfo.TableSizeBytes ?? 0}</div>
              </div>
            </div>
          )}
          {selectedTable && items.length > 0 && (
            <div className="rounded-lg border overflow-x-auto" style={{ borderColor: "var(--border)" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "var(--bg-tertiary)" }}>
                    {allKeys.map((key) => (
                      <th key={key} className="text-left px-4 py-2 font-medium whitespace-nowrap">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => {
                    const flat = flattenDDBItem(item);
                    return (
                      <tr key={idx} className="border-t" style={{ borderColor: "var(--border)" }}>
                        {allKeys.map((key) => (
                          <td key={key} className="px-4 py-2 whitespace-nowrap font-mono text-xs">
                            {flat[key] ?? "-"}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {selectedTable && items.length === 0 && tableInfo && (
            <div className="text-center py-12" style={{ color: "var(--text-secondary)" }}>
              Table is empty
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
