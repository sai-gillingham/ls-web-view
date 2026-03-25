import { NextResponse } from "next/server";
import { getInfo } from "@/lib/localstack-client";

export async function GET() {
  try {
    const info = await getInfo();
    return NextResponse.json(info);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 502 });
  }
}
