"use server"

import Razorpay from "razorpay"
import Payment from "@/models/Payment"
import connectDb from "@/db/connectDb"
import User from "@/models/User"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"


export const initiate = async (amount, to_username, paymentform) => {
    await connectDb()
    
    // Fetch the secret of the user who is getting the payment
    let user = await User.findOne({ username: to_username })
    if (!user) {
        throw new Error("Recipient user not found")
    }

    // Support fallback to platform credentials if the user hasn't set their own
    const key_id = user.razorpayid || process.env.NEXT_PUBLIC_KEY_ID
    const key_secret = user.razorpaysecret || process.env.KEY_SECRET

    if (!key_id || !key_secret) {
        throw new Error("Razorpay credentials are not configured on the platform")
    }

    const instance = new Razorpay({ key_id, key_secret })
    
    let options = {
        amount: Number.parseInt(amount),
        currency: "INR",
    } 
    let x = await instance.orders.create(options)
   
    // Create a payment object which shows a pending payment in the database
    await Payment.create({
        oid: x.id,
        amount: amount / 100,
        to_user: to_username,
        name: paymentform.name,
        message: paymentform.message
    })

    return x
}

export const fetchuser = async (username) => {
    await connectDb()
    const u = await User.findOne({ username })
    if (!u) return null
    const user = u.toObject()
    user._id = user._id.toString()  // ✅ convert ObjectId to string
    // Sanitize sensitive fields before returning to public client pages
    delete user.razorpaysecret
    return user
}

export const fetchuserForDashboard = async () => {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.email) {
        throw new Error("Unauthorized access to dashboard data")
    }
    await connectDb()
    const u = await User.findOne({ email: session.user.email })
    if (!u) return null
    const user = u.toObject()
    user._id = user._id.toString()
    return user
}

export const fetchpayments = async (username) => {
    await connectDb()
    
    // Find all payments sorted by decreasing order of amount
    const paymentsDocs = await Payment.find({ to_user: username, done: true }).sort({ amount: -1 }).limit(7).lean()

    if (!paymentsDocs || paymentsDocs.length === 0) return []

    // Convert each Mongoose document to a plain object
    const payments = paymentsDocs.map(doc => {
        const p = { ...doc }           // convert to plain object
        p._id = p._id.toString()           // convert ObjectId to string
        return p
    })

    return payments
}

export const profilepic = async (data) => {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.email) {
        return { error: "Unauthorized" }
    }
    
    await connectDb()
    let ndata = Object.fromEntries(data)
    
    const email = session.user.email
    const currentUser = await User.findOne({ email })
    if (!currentUser) {
        return { error: "User not found" }
    }

    const oldusername = currentUser.username
    const newUsername = ndata.username ? ndata.username.trim() : ""

    if (!newUsername || newUsername.length < 3) {
        return { error: "Username must be at least 3 characters long" }
    }
    if (/\s/.test(newUsername)) {
        return { error: "Username cannot contain spaces" }
    }

    // Force non-editable email to prevent user identity hijacking or session locking
    ndata.email = email

    if (oldusername !== newUsername) {
        let u = await User.findOne({ username: newUsername })
        if (u) {
            return { error: "Username already exists" }
        }
        await User.updateOne({ email }, ndata)
        // Now update all the usernames in the Payments table
        await Payment.updateMany({ to_user: oldusername }, { to_user: newUsername })
    } else {
        await User.updateOne({ email }, ndata)
    }

    return { success: true }
}