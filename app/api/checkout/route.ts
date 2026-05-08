import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const licensePrices: Record<string, number> = {
  "Basic Lease": 2900,
  "Premium Lease": 7900,
  "Exclusive": 29900,
};

export async function POST(req: Request) {
  try {
    const { beatTitle, licenseType } = await req.json();

    const selectedLicense = licenseType || "Basic Lease";
    const amount = licensePrices[selectedLicense];

    if (!amount) {
      return NextResponse.json(
        { error: "Invalid license type" },
        { status: 400 }
      );
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${beatTitle} - ${selectedLicense}`,
              description: "TrifeBeats digital beat license",
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],

      metadata: {
        beatTitle,
        licenseType: selectedLicense,
      },

      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cancel`,
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);

    return NextResponse.json(
      { error: "Checkout failed" },
      { status: 500 }
    );
  }
}