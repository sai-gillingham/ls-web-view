"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Bell, RefreshCw } from "lucide-react";

interface SNSTopic {
  TopicArn: string;
}

export default function SNSPage() {
  const [topics, setTopics] = useState<SNSTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sns/topics");
      const data = await res.json();
      setTopics(data.topics ?? []);
    } catch {}
    setLoading(false);
  };

  const getTopicName = (arn: string) => arn.split(":").pop() ?? arn;

  return (
    <div>
      <PageHeader title="SNS Topics" description="Simple Notification Service">
        <button
          onClick={fetchTopics}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm border"
          style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </PageHeader>

      <div className="p-6">
        {loading && <div className="animate-pulse" style={{ color: "var(--text-secondary)" }}>Loading...</div>}
        {!loading && topics.length === 0 && (
          <div className="text-center py-12" style={{ color: "var(--text-secondary)" }}>
            No SNS topics found
          </div>
        )}
        {topics.length > 0 && (
          <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--border)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--bg-tertiary)" }}>
                  <th className="text-left px-4 py-2 font-medium">Topic Name</th>
                  <th className="text-left px-4 py-2 font-medium">ARN</th>
                </tr>
              </thead>
              <tbody>
                {topics.map((topic) => (
                  <tr key={topic.TopicArn} className="border-t" style={{ borderColor: "var(--border)" }}>
                    <td className="px-4 py-2 flex items-center gap-2">
                      <Bell className="w-4 h-4" style={{ color: "var(--accent)" }} />
                      {getTopicName(topic.TopicArn)}
                    </td>
                    <td className="px-4 py-2 font-mono text-xs" style={{ color: "var(--text-secondary)" }}>
                      {topic.TopicArn}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
