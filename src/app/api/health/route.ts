import { NextResponse } from "next/server";
import { getHealth } from "@/lib/localstack-client";

export async function GET() {
  try {
    const health = await getHealth();
    return NextResponse.json(health);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 502 });
  }
}
