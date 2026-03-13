import NextAuth from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import User from '@/models/User';
import connectDb from '@/db/connectDb';

export const authOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
        }),
    ],

    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            if (account.provider == "github") {
                await connectDb()
                
                // If GitHub doesn't return an email (can happen with private emails)
                // Use a fallback or handle properly
                const userEmail = user.email || `${profile.login}@github.com`

                // Check if the user already exists in the database
                const currentUser = await User.findOne({ email: userEmail })
                if (!currentUser) {
                    // Create a new User
                    const newUser = await User.create({
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