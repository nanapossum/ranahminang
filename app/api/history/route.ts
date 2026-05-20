import { NextResponse } from "next/server";
import { histories } from "@/data/history";

export function GET() {
  return NextResponse.json({
    data: histories
  });
}
