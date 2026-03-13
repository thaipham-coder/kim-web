import { NextResponse } from "next/server";
import { queryOrderStatus } from "@/lib/zalopay";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { appTransId } = body;

    if (!appTransId) {
      return NextResponse.json({ error: "Missing appTransId" }, { status: 400 });
    }

    const statusObj = await queryOrderStatus(appTransId);

    return NextResponse.json(statusObj);
  } catch (error: any) {
    console.error("ZaloPay Query Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
