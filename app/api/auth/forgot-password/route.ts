import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      // Don't reveal if email exists
      return NextResponse.json(
        { message: "If an account with that email exists, a reset link has been sent" },
        { status: 200 },
      )
    }

    // Delete existing reset tokens
    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } })

    // Create new reset token (valid for 1 hour)
    const token = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    })

    // In production, send email with reset link
    // const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`
    // await sendResetEmail(email, resetUrl)

    return NextResponse.json({ message: "Password reset link sent to email" }, { status: 200 })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
