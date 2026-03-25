import { NextResponse } from "next/server";
import { dynamodbClient } from "@/lib/aws-clients";
import { DescribeTableCommand, ScanCommand } from "@aws-sdk/client-dynamodb";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ table: string }> }
) {
  try {
    const { table } = await params;
    const url = new URL(_request.url);
    const action = url.searchParams.get("action") ?? "describe";

    if (action === "scan") {
      const result = await dynamodbClient.send(new ScanCommand({ TableName: table, Limit: 100 }));
      return NextResponse.json({ items: result.Items ?? [], count: result.Count });
    }

    const result = await dynamodbClient.send(new DescribeTableCommand({ TableName: table }));
    return NextResponse.json({ table: result.Table });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
