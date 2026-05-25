import NextAuth from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import User from '@/models/User';
import connectDb from '@/db/connectDb';

export const authOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                email: { label: "Email", type: "email" },
            },
            async authorize(credentials) {
                if (!credentials || !credentials.username || !credentials.email) {
                    return null
                }
                // Validate email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                if (!emailRegex.test(credentials.email)) {
                    console.warn("Invalid email format attempted")
                    return null
                }
                return {
                    id: credentials.username,
                    name: credentials.username,
                    email: credentials.email
                }
            }
        })
    ],

    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            await connectDb()
            if (account.provider === "github") {
                const userEmail = user.email || `${profile.login}@github.com`
                const currentUser = await User.findOne({ email: userEmail })
                if (!currentUser) {
                    await User.create({
                        email: userEmail,
                        username: (userEmail).split("@")[0],
                    })
                }
                return true
            }
            if (account.provider === "credentials") {
                const userEmail = user.email
                const currentUser = await User.findOne({ email: userEmail })
                if (!currentUser) {
                    await User.create({
                        email: userEmail,
                        username: (userEmail).split("@")[0],
                    })
                }
                return true
            }
            return true
        },
        async session({ session, user, token }) {
            try {
                await connectDb()
                const dbUser = await User.findOne({ email: session.user.email })
                if (dbUser) {
                    session.user.name = dbUser.username
                }
                return session
            } catch (error) {
                console.error("Session callback error:", error)
                return session
            }
        },
    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }