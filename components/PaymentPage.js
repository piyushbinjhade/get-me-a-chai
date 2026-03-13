'use client'
import React, { useEffect, useState } from 'react'
import Script from 'next/script'
import { fetchuser, fetchpayments, initiate } from '@/actions/useractions'
import { useSearchParams } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify';
import { Bounce } from 'react-toastify'
import { useRouter } from 'next/navigation'


const PaymentPage = ({ username }) => {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(null)
  const [payments, setPayments] = useState([])
  const searchParams = useSearchParams()
  const [paymentform, setPaymentForm] = useState({
    name: "",
    amount: "",
    message: ""
  })
  const [isClient, setIsClient] = useState(false) // for SSR-safe rendering

  useEffect(() => {
    setIsClient(true)
    getData()
  }, [])

  useEffect(() => {
    if(searchParams.get("paymentdone") == "true"){
    toast('Payment has been made', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  }
  router.push(`/${username}`)

  }, [])


  const handleChange = (e) => {
    setPaymentForm({ ...paymentform, [e.target.name]: e.target.value })
  }

  const getData = async () => {
    try {
      const u = await fetchuser(username)
      setCurrentUser(u)
      const dbPayments = await fetchpayments(username)
      setPayments(dbPayments)
    } catch (err) {
      // console.error("Error fetching data:", err)
    }
  }

  const Pay = async (amountInSubunits) => {
    // Client-side validation
    if (!paymentform.name || !paymentform.amount) {
      alert("Name and Amount are required")
      return
    }

    if (!currentUser || !currentUser.razorpayid) {
      alert("Razorpay ID not available")
      return
    }

    try {
      const order = await initiate(amountInSubunits, username, paymentform)
      const orderId = order.id

      const options = {
        key: currentUser.razorpayid,
        amount: amountInSubunits,
        currency: "INR",
        name: "Get Me A Chai",
        description: "Payment Transaction",
        image: "https://example.com/your_logo",
        order_id: orderId,
        callback_url: `${process.env.NEXT_PUBLIC_URL}/api/razorpay`,
        prefill: {
          name: paymentform.name,
          email: "customer@example.com",
          contact: "+919876543210"
        },
        notes: {
          address: "Razorpay Corporate Office"
        },
        theme: { color: "#3399cc" }
      }

      const rzp1 = new Razorpay(options)
      rzp1.open()
    } catch (err) {
      // console.error("Payment error:", err)
      alert("Payment initiation failed")
    }
  }

  // SSR-safe check
  if (!isClient) return null

  return (
    <div>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <div className="cover bg-red-50 relative">
        <img
          className='object-cover w-full h-48 md:h-[350]'
          src={currentUser?.coverpic || '/default-cover.jpg'}
          alt="Cover Picture"
        />
        <div className="absolute -bottom-12 right-[32%] md:right-[44.5%] border-white border-[2px] rounded-xl">
          <img
            className='rounded-xl'
            width={135}
            height={135}
            src={currentUser?.profilepic || '/default-profile.jpg'}
            alt="Profile Picture"
          />
        </div>
      </div>

      <div className="info flex justify-center items-center my-14 flex-col">
        <div className='font-bold text-lg'>@{username}</div>
        <div className='text-slate-400'>Lets help {username} get a chai!</div>
        <div className='text-slate-400'>Payments .₹{payments.reduce((a,b) => a+b.amount,0)} collected  </div>

        <div className="payment flex gap-3 w-[80%] mt-11 flex-col md:flex-row">
          <div className="supporters w-full md:w-1/2 bg-slate-900 rounded-lg text-white p-10">
            <h2 className='text-2xl text-center font-bold my-5'>Customers</h2>
            <ul className='mx-4 text-sm'>
              {payments.length === 0 ? <li>No payments yet</li> :
                payments.map((p, i) => (
                  <li key={i} className='my-4 flex gap-2 items-center'>
                    <img width={33} src="avatar.gif" alt="user avatar" />
                    <span>{p.name} paid <span className='font-bold'>₹{p.amount}</span> for {p.message}</span>
                  </li>
                ))
              }
            </ul>
          </div>

          <div className="makePayment w-full md:w-1/2 bg-slate-900 rounded-lg text-white p-10">
            <h2 className='text-2xl font-bold my-5'>Make a Payment</h2>
            <div className="flex gap-2 flex-col">
              <input
                onChange={handleChange}
                value={paymentform.name}
                name='name'
                type="text"
                className='w-full p-3 rounded-lg bg-slate-800'
                placeholder='Enter Name'
              />
              <input
                onChange={handleChange}
                value={paymentform.message}
                name='message'
                type="text"
                className='w-full p-3 rounded-lg bg-slate-800'
                placeholder='Enter Message'
              />
              <input
                onChange={handleChange}
                value={paymentform.amount}
                name='amount'
                type="text"
                className='w-full p-3 rounded-lg bg-slate-800'
                placeholder='Enter Amount'
              />
              <button
                onClick={() => Pay(Number.parseInt(paymentform.amount) * 100)}
                type="button"
                className="w-full text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 disabled:bg-slate-400 disabled:from-purple-100" disabled={paymentform.name?.length < 3 || paymentform.message?.length < 4 || paymentform.amount?.length <1}>
                Pay
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-2 mt-2">
              <button className='bg-slate-800 p-3 rounded-lg' onClick={() => Pay(1000)}>Pay ₹10</button>
              <button className='bg-slate-800 p-3 rounded-lg' onClick={() => Pay(3000)}>Pay ₹30</button>
              <button className='bg-slate-800 p-3 rounded-lg' onClick={() => Pay(5000)}>Pay ₹50</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage
