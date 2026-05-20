import { NextResponse } from "next/server";
import { locations } from "@/data/locations";

export function GET() {
  return NextResponse.json({
    data: locations
  });
}
