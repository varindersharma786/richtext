import { NextRequest, NextResponse } from "next/server";

const base = "https://api-m.sandbox.paypal.com";

async function generateAccessToken() {
    try {
        if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
            throw new Error("MISSING_API_CREDENTIALS");
        }
        const auth = Buffer.from(
            process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_CLIENT_SECRET
        ).toString("base64");

        const response = await fetch(`${base}/v1/oauth2/token`, {
            method: "POST",
            body: "grant_type=client_credentials",
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error("Failed to generate Access Token:", error);
        throw error;
    }
}

export async function POST(req: NextRequest) {
    try {
        const { items } = await req.json();

        // Calculate total amount in USD (convert from INR)
        const totalINR = items.reduce(
            (sum: number, item: any) => sum + item.price * item.quantity,
            0
        );
        // Simple conversion: 1 USD = 83 INR (adjust as needed)
        const totalUSD = (totalINR / 83).toFixed(2);

        const accessToken = await generateAccessToken();
        const url = `${base}/v2/checkout/orders`;

        const payload = {
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: totalUSD,
                    },
                    description: `Order for ${items.length} item(s)`,
                },
            ],
        };

        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            method: "POST",
            body: JSON.stringify(payload),
        });

        const jsonResponse = await response.json();
        return NextResponse.json(jsonResponse);
    } catch (error: any) {
        console.error("Create order error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create order" },
            { status: 500 }
        );
    }
}
