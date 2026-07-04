import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error:  '/login',
  },
  providers: [
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      id:   'credentials',
      name: 'Email & Password',
      credentials: {
        email:    { label: 'Email',    type: 'email'    },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })
        if (!user || !user.passwordHash) return null
        const valid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )
        if (!valid) return null
        return {
          id:    user.id,
          email: user.email,
          name:  user.name,
          image: user.image,
          role:  user.role,
        }
      },
    }),
    CredentialsProvider({
      id:   'otp',
      name: 'Phone OTP',
      credentials: {
        phone: { label: 'Phone', type: 'tel'  },
        otp:   { label: 'OTP',   type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.otp) return null
        const record = await prisma.oTP.findFirst({
          where: {
            phone:     credentials.phone as string,
            code:      credentials.otp as string,
            purpose:   'login',
            used:      false,
            expiresAt: { gt: new Date() },
          },
          include: { user: true },
        })
        if (!record) return null
        await prisma.oTP.update({ where: { id: record.id }, data: { used: true } })
        let user = record.user
        if (!user) {
          user = await prisma.user.create({
            data: { phone: credentials.phone as string, phoneVerified: new Date() },
          })
        }
        return { id: user.id, email: user.email, name: user.name, image: user.image, role: user.role }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id
        token.role = (user as { role?: string }).role ?? 'CUSTOMER'
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id   = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
})

// Extend session types
declare module 'next-auth' {
  interface Session {
    user: {
      id:    string
      role:  string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}
