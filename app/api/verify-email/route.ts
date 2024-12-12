import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const baseUrl = process.env.APP_URL || "http://localhost:3000"; // Asegúrate de definir APP_URL en tus variables de entorno
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(`${baseUrl}/api/verify-email/error`);
  }

  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken || verificationToken.expiresAt < new Date()) {
      return NextResponse.redirect(`${baseUrl}/api/verify-email/error`);
    }

    await prisma.user.update({
      where: { id: verificationToken.userId },
      data: { isVerified: true },
    });

    await prisma.verificationToken.delete({
      where: { id: verificationToken.id },
    });

    return NextResponse.redirect(`${baseUrl}/api/verify-email/success`);
  } catch (error) {
    console.error("Error al verificar el token:", error);
    return NextResponse.redirect(`${baseUrl}/api/verify-email/error`);
  }
}
