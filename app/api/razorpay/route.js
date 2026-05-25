import { NextResponse } from "next/server";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import Payment from "@/models/Payment";
import connectDb from "@/db/connectDb";
import User from "@/models/User";

export const POST = async (req) => {
    try {
        await connectDb()
        let body = await req.formData()
        body = Object.fromEntries(body)

        // Validate required fields
        if (!body.razorpay_order_id || !body.razorpay_payment_id || !body.razorpay_signature) {
            return NextResponse.json({ success: false, message: "Missing payment verification data" }, { status: 400 })
        }

        // Check if razorpayOrderId is present on the server
        let p = await Payment.findOne({ oid: body.razorpay_order_id })
        if (!p) {
            return NextResponse.json({ success: false, message: "Order Id not found" }, { status: 404 })
        }

        // Fetch the secret of the user who is getting the payment, with fallback to platform credentials
        let user = await User.findOne({ username: p.to_user })
        const secret = (user && user.razorpaysecret) ? user.razorpaysecret : process.env.KEY_SECRET

        if (!secret) {
            return NextResponse.json({ success: false, message: "Payment gateway credentials are not configured" }, { status: 500 })
        }

        // Verify the payment signature
        let isValid = validatePaymentVerification(
            { "order_id": body.razorpay_order_id, "payment_id": body.razorpay_payment_id },
            body.razorpay_signature,
            secret
        )

    if (isValid) {
        // Update the payment status to done: true (Crucial Bug Fix!)
        const updatedPayment = await Payment.findOneAndUpdate(
            { oid: body.razorpay_order_id },
            { done: true },
            { new: true }
        )
        
        // Construct the redirect URL with proper protocol and host
        const baseUrl = process.env.NEXT_PUBLIC_URL || `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}`
        const redirectUrl = `${baseUrl}/${updatedPayment.to_user}?paymentdone=true`
        
        // Return 303 Redirect to force a GET request back to the user page
        return NextResponse.redirect(redirectUrl, 303)
    } else {
        return NextResponse.json({ success: false, message: "Payment Verification Failed" }, { status: 400 })
    }
    } catch (error) {
        console.error("Razorpay callback error:", error)
        return NextResponse.json({ success: false, message: "Payment processing failed", error: error.message }, { status: 500 })
    }
}