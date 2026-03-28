import { NextResponse } from "next/server";
import { getAvailableMarkets } from "@/lib/agent-finder/markets";

export async function GET() {
  const markets = await getAvailableMarkets();
  return NextResponse.json({ markets });
}