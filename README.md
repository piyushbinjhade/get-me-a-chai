# ☕ Get Me A Chai

**Get Me A Chai** is a modern crowdfunding platform built for creators to receive support from their fans. Fans can "buy a chai" for their favorite creators, providing a simple and interactive way to fund projects and show appreciation.

## 🚀 Features

- **Creator Profiles**: Personalized pages for creators to showcase their work and receive payments
- **Multiple Payment Options**: Quick pay buttons (₹10, ₹30, ₹50) plus custom amounts
- **Secure Payments**: Integrated with **Razorpay** for seamless and secure transactions
- **Social Authentication**: Easy login using **GitHub** powered by **NextAuth.js**
- **Dashboard**: Creators can manage their profile, upload pictures, and track contributions
- **Payment History**: View all supporters and payment amounts
- **Modern UI**: Built with **Next.js 15**, **React 19**, and **Tailwind CSS** for a fast, responsive experience
- **Database**: **MongoDB** integration with Mongoose for robust data management
- **User-Specific Payments**: Support for individual creator Razorpay credentials with platform fallback

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Library**: [React 19](https://react.dev/)
- **Authentication**: [NextAuth.js v4](https://next-auth.js.org/)
- **Payment Gateway**: [Razorpay](https://razorpay.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose v8](https://mongoosejs.com/)
- **Notifications**: [React Toastify](https://fkhadra.github.io/react-toastify/)
- **Linting**: [ESLint](https://eslint.org/)

## ⚙️ Getting Started

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** or **yarn**
- **MongoDB Atlas** account or local MongoDB instance
- **Razorpay** account (for payment processing)
- **GitHub Developer** account (for OAuth login - optional but recommended)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/get-me-a-chai.git
   cd get-me-a-chai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   
   Copy the template file and fill in your credentials:
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` with your values:
   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/get-me-chai?retryWrites=true&w=majority

   # NextAuth Configuration (Generate using: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
   NEXTAUTH_SECRET=your-32-character-hex-string
   NEXTAUTH_URL=http://localhost:3000

   # GitHub OAuth (Optional - for GitHub login)
   GITHUB_ID=your_github_oauth_app_id
   GITHUB_SECRET=your_github_oauth_app_secret

   # Razorpay Configuration
   NEXT_PUBLIC_KEY_ID=your_razorpay_key_id
   KEY_SECRET=your_razorpay_key_secret

   # Public URL for payment redirects
   NEXT_PUBLIC_URL=http://localhost:3000
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
get-me-a-chai/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/    # NextAuth configuration
│   │   └── razorpay/              # Payment callback handler
│   ├── dashboard/                  # Creator dashboard
│   ├── login/                       # Login page
│   ├── [username]/                 # Creator profile pages
│   ├── about/                       # About page
│   ├── layout.js                    # Root layout
│   └── page.js                      # Home page
├── components/
│   ├── Navbar.js                    # Navigation bar
│   ├── Footer.js                    # Footer
│   ├── SessionWrapper.js            # NextAuth session wrapper
│   └── PaymentPage.js               # Payment component
├── db/
│   └── connectDb.js                 # MongoDB connection
├── models/
│   ├── User.js                      # User schema
│   └── Payment.js                   # Payment schema
├── actions/
│   └── useractions.js               # Server actions
├── public/                          # Static assets
└── .env.local                       # Environment variables
```

## 🔑 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `NEXTAUTH_SECRET` | Secret key for NextAuth encryption (32+ chars) | Generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `NEXTAUTH_URL` | Base URL for authentication | `http://localhost:3000` |
| `NEXT_PUBLIC_KEY_ID` | Razorpay API Key ID | `rzp_test_XXXXXX` |
| `KEY_SECRET` | Razorpay API Secret | `XXXXXX` |
| `NEXT_PUBLIC_URL` | Public URL for payment redirects | `http://localhost:3000` |

### Optional Variables

| Variable | Description |
|----------|-------------|
| `GITHUB_ID` | GitHub OAuth App ID (for GitHub login) |
| `GITHUB_SECRET` | GitHub OAuth App Secret |

## 🚀 Running Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 📊 How It Works

### User Flow

1. **Sign Up/Login**
   - Users can login via GitHub or credentials
   - New users are automatically created in the database

2. **Creator Setup**
   - After login, creators go to dashboard
   - Update profile: name, username, profile picture, cover picture
   - (Optional) Add their own Razorpay credentials

3. **Share Profile**
   - Creators share their unique profile URL: `yourdomain.com/username`

4. **Receive Payments**
   - Fans visit creator's page
   - Select amount or enter custom amount
   - Complete payment via Razorpay
   - Payment recorded in database

5. **Dashboard View**
   - Creators see all payments received
   - Sorted by amount (highest first)
   - Limited to 7 most recent payments

### Payment Flow

1. Payment initiated via `initiate()` server action
2. Razorpay order created with unique order ID
3. Frontend opens Razorpay checkout modal
4. User completes payment
5. Razorpay sends callback to `/api/razorpay`
6. Signature verified server-side
7. Payment status updated to `done: true`
8. User redirected to creator's profile with success message

## 🔐 Security Features

- ✅ NextAuth handles session management and CSRF protection
- ✅ Server-side Razorpay signature verification
- ✅ Email validation in authentication
- ✅ User sensitive data (razorpaysecret) never exposed to frontend
- ✅ Email field locked in dashboard (cannot be changed)
- ✅ Environment variables for all secrets

## 📱 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/[...nextauth]` | GET, POST | NextAuth authentication |
| `/api/razorpay` | POST | Payment verification callback |

## 🎨 Customization

### Tailwind CSS
Configuration file: `tailwind.config.js`

### Theme Colors
- Primary: Purple to Blue gradient (`from-purple-600 to-blue-500`)
- Dark background: Slate-900 and gray-900

## 📦 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

```env
MONGODB_URI=your_production_mongodb_uri
NEXTAUTH_SECRET=your_production_secret_min_32_chars
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_URL=https://yourdomain.com
GITHUB_ID=your_production_github_id
GITHUB_SECRET=your_production_github_secret
NEXT_PUBLIC_KEY_ID=your_production_razorpay_key
KEY_SECRET=your_production_razorpay_secret
```

## ✅ Production Checklist

- [ ] Environment variables configured with production values
- [ ] NEXTAUTH_SECRET is a strong random 32+ character string
- [ ] MongoDB Atlas cluster configured with proper network access
- [ ] HTTPS enabled on production domain
- [ ] Razorpay production API keys configured
- [ ] GitHub OAuth app configured for production domain
- [ ] Build passes without warnings: `npm run build`
- [ ] Payment flow tested end-to-end
- [ ] User registration and login tested
- [ ] All images load correctly
- [ ] Mobile responsive design verified
- [ ] Error monitoring/logging configured

## 🐛 Troubleshooting

### Payment not working
- Check if `NEXTAUTH_SECRET` is set and server is restarted
- Verify Razorpay credentials are correct
- Ensure `NEXT_PUBLIC_URL` matches your domain

### Login issues
- Verify `NEXTAUTH_URL` is correct
- Check if MongoDB connection is working
- Ensure NEXTAUTH_SECRET is properly set

### Build errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `npm install`
- Check for typos in environment variables

---

**Made with ❤️ for creators** ☕