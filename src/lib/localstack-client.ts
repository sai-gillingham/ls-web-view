const LOCALSTACK_ENDPOINT = process.env.LOCALSTACK_ENDPOINT ?? "http://localhost:4566";

export interface ServiceHealth {
  [serviceName: string]: string;
}

export interface HealthResponse {
  services: ServiceHealth;
  edition: string;
  version: string;
}

export interface InfoResponse {
  version: string;
  edition: string;
  session_id: string;
  machine_id: string;
  system: string;
  is_docker: boolean;
  uptime: number;
}

export async function getHealth(): Promise<HealthResponse> {
  const res = await fetch(`${LOCALSTACK_ENDPOINT}/_localstack/health`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
  return res.json();
}

export async function getInfo(): Promise<InfoResponse> {
  const res = await fetch(`${LOCALSTACK_ENDPOINT}/_localstack/info`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Info request failed: ${res.status}`);
  return res.json();
}

export async function getSqsMessages(region?: string, accountId?: string, queueName?: string): Promise<any> {
  let url = `${LOCALSTACK_ENDPOINT}/_aws/sqs/messages`;
  if (region && accountId && queueName) {
    url = `${LOCALSTACK_ENDPOINT}/_aws/sqs/messages/${region}/${accountId}/${queueName}`;
  }
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`SQS messages request failed: ${res.status}`);
  return res.json();
}

export async function getSesEmails(): Promise<any> {
  const res = await fetch(`${LOCALSTACK_ENDPOINT}/_aws/ses`, { cache: "no-store" });
  if (!res.ok) throw new Error(`SES request failed: ${res.status}`);
  return res.json();
}

export async function getCloudwatchRawMetrics(): Promise<any> {
  const res = await fetch(`${LOCALSTACK_ENDPOINT}/_aws/cloudwatch/metrics/raw`, { cache: "no-store" });
  if (!res.ok) throw new Error(`CloudWatch metrics request failed: ${res.status}`);
  return res.json();
}

export { LOCALSTACK_ENDPOINT };
