import { NextResponse } from "next/server";
import { lambdaClient } from "@/lib/aws-clients";
import { ListFunctionsCommand } from "@aws-sdk/client-lambda";

export async function GET() {
  try {
    const result = await lambdaClient.send(new ListFunctionsCommand({}));
    return NextResponse.json({ functions: result.Functions ?? [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
