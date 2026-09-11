import { NextResponse } from "next/server";
import { prisma, hasDatabase } from "@/lib/prisma";
import { toNumber } from "@/lib/money";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!hasDatabase()) return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  const number = new URL(request.url).searchParams.get("number") || "";
  if (!number) return NextResponse.json({ error: "Missing order" }, { status: 400 });
  const order = await prisma.order.findUnique({ where: { number } });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  const total = typeof order.total === "object" && order.total && "toNumber" in order.total ? order.total.toNumber() : Number(order.total);
  return NextResponse.json({
    order: {
      number: order.number,
      status: order.status,
      paymentMethod: order.paymentMethod,
      total,
      paymentImage: order.paymentImage,
      paymentNote: order.paymentNote,
      customerPaidAt: order.customerPaidAt ? order.customerPaidAt.toISOString() : null,
      detailsReady: Boolean(order.paymentImage || order.paymentNote),
      confirmed: order.status !== "PENDING_PAYMENT" && order.status !== "CANCELLED",
    },
  });
}

export async function POST(request: Request) {
  if (!hasDatabase()) return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  const body = await request.json();
  const number = typeof body.number === "string" ? body.number : "";
  const order = await prisma.order.update({ where: { number }, data: { customerPaidAt: new Date() } });
  return NextResponse.json({ order: { number: order.number, customerPaidAt: order.customerPaidAt } });
}
