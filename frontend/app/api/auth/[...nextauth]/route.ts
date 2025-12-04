import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {
                try {
                    // Sync with backend
                    await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/auth/login`, {
                        email: user.email,
                        name: user.name,
                        google_id: user.id,
                    });
                    return true;
                } catch (error) {
                    console.error("Backend sync failed:", error);
                    return true; // Allow login even if backend sync fails for now (MVP)
                }
            }
            return true;
        },
        async session({ session, token }) {
            // Add backend token or user ID to session if needed
            if (session.user) {
                // @ts-ignore
                session.user.id = token.sub;
            }
            return session;
        },
    },
    pages: {
        signIn: "/auth/signin", // Optional: Custom sign-in page
    },
});

export { handler as GET, handler as POST };
