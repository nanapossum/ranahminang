import { NextResponse } from "next/server";
import { cultures } from "@/data/cultures";

export function GET() {
  return NextResponse.json({
    data: cultures
  });
}
