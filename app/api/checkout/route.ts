import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  try {
    const { beatTitle, price, audio } = await req.json();

    const amount = Number(price.replace("$", "")) * 100;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: beatTitle,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],

      metadata: {
        beatTitle,
        audio,
      },

      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?beat=${encodeURIComponent(
        beatTitle
      )}&audio=${encodeURIComponent(audio)}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Stripe checkout failed" },
      { status: 500 }
    );
  }
}