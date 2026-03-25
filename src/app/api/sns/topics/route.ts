import { NextResponse } from "next/server";
import { snsClient } from "@/lib/aws-clients";
import { ListTopicsCommand } from "@aws-sdk/client-sns";

export async function GET() {
  try {
    const result = await snsClient.send(new ListTopicsCommand({}));
    return NextResponse.json({ topics: result.Topics ?? [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
