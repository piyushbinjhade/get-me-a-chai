"use server"

import Razorpay from "razorpay"
import Payment from "@/models/Payment"
import connectDb from "@/db/connectDb"
import User from "@/models/User"


export const initiate = async ( amount, to_username, paymentform) =>{
    await connectDb()
     //  fetch the sectre of the user who is getting the payment
    let user = await User.findOne({username: to_username})
    const secret = user.razorpaysecret
    var instance = new Razorpay({ key_id: user.razorpayid, key_secret: process.env.KEY_SECRET })
    
    let options = {
        amount: Number.parseInt(amount),
        currency: "INR",
    } 
    let x = await instance.orders.create(options)
   
    //  create a payment object which shows a pending payment in the databsae
    await Payment.create({oid: x.id, amount: amount/100, to_user: to_username, name: paymentform.name, message: paymentform.message})

    return x
}

export const fetchuser = async (username) => {
    await connectDb()
    const u = await User.findOne({ username })
    if (!u) return null
    const user = u.toObject()
    user._id = user._id.toString()  // ✅ convert ObjectId to string
    return user
}



export const fetchpayments = async (username) => {
    await connectDb()
    
    // Find all payments sorted by decreasing order of amount
    const paymentsDocs = await Payment.find({ to_user: username, done:true }).sort({ amount: -1 }).limit(7).lean()

    if (!paymentsDocs || paymentsDocs.length === 0) return []

    // Convert each Mongoose document to a plain object
    const payments = paymentsDocs.map(doc => {
        const p = { ...doc }           // convert to plain object
        p._id = p._id.toString()           // convert ObjectId to string
        return p
    })

    return payments
}


export const profilepic = async (data, oldusername) => {
    await connectDb()
    let ndata = Object.fromEntries(data)

    //  If the username is being updated, check if username is available
    if(oldusername != ndata.username) {
        let u = await User.findOne({username: ndata.username})
        if(u){
            return { error: "Username already exists"}
        }
        await User.updateOne({email: ndata.email}, ndata)
        // Now update all the usernames in the Payments table
        await Payment.updateMany({to_user: oldusername}, {to_user: ndata.username})
    }
    else{
        await User.updateOne({email: ndata.email}, ndata)
    }
}