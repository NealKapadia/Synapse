import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

export async function POST(req: NextRequest) {
    try {
        const { phoneNumber, messageBody } = await req.json();

        if (!phoneNumber || !messageBody) {
            return NextResponse.json(
                { error: "phoneNumber and messageBody are required fields." },
                { status: 400 }
            );
        }

        if (!accountSid || !authToken || !twilioPhoneNumber) {
            console.error("Missing Twilio credentials in environment variables.");
            return NextResponse.json(
                { error: "SMS service is not properly configured." },
                { status: 500 }
            );
        }

        const message = await client.messages.create({
            body: messageBody,
            from: twilioPhoneNumber,
            to: phoneNumber,
        });

        return NextResponse.json({ success: true, messageId: message.sid });

    } catch (error: any) {
        console.error("Twilio SMS Error:", error);
        return NextResponse.json(
            { error: error?.message || "Failed to send SMS." },
            { status: 500 }
        );
    }
}
