import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getSettings } from "@/lib/settings";
import { ALL_CURRENCIES } from "@/lib/currenciesList";

export async function POST(req: Request) {
  try {
    const settings = await getSettings();

    if (!settings.enableRazorpay) {
      return NextResponse.json({ error: "Razorpay gateway is disabled" }, { status: 400 });
    }

    const { amount, currency: reqCurrency } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const keyId = settings.razorpayKeyId;
    const keySecret = settings.razorpayKeySecret;

    if (!keyId || !keySecret) {
      return NextResponse.json({ error: "Razorpay API credentials not configured" }, { status: 500 });
    }

    // Initialize Razorpay
    const instance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    // Convert amount to paise (smallest currency unit for INR)
    const amountInPaise = Math.round(amount * 100);

    const rawCurrency = reqCurrency || settings.currency || "INR";
    const matchedCurrency = ALL_CURRENCIES.find(c => c.symbol === rawCurrency || c.code === rawCurrency);
    const currency = (matchedCurrency ? matchedCurrency.code : "INR").toUpperCase();

    const options = {
      amount: amountInPaise,
      currency: currency,
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await instance.orders.create(options);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: keyId,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create Razorpay order" }, { status: 500 });
  }
}
