import { NextResponse } from "next/server";
import { dynamodbClient } from "@/lib/aws-clients";
import { ListTablesCommand } from "@aws-sdk/client-dynamodb";

export async function GET() {
  try {
    const result = await dynamodbClient.send(new ListTablesCommand({}));
    return NextResponse.json({ tables: result.TableNames ?? [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
