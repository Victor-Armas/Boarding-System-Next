"use server";

import { prisma } from "@/src/lib/prisma";
import { UserSchema } from "@/src/schema";
import { sendVerificationEmail } from "@/src/lib/email";
import bcrypt from "bcryptjs"; // Para cifrar contraseñas
import crypto from "crypto"; // Para generar el token
import { User } from "@prisma/client";
import { CreateUserType } from "@/src/types";

function generateToken() {
  return crypto.randomBytes(32).toString("hex"); // Token seguro de 32 bytes
}

export async function createUser(data: CreateUserType) {
  const result = UserSchema.safeParse(data);

  if (!result.success) {
    // Validación fallida, retorna los errores
    return {
      errors: result.error.issues,
    };
  }

  // Generar el token de verificación
  const token = generateToken();

  try {
    // Cifrar la contraseña antes de almacenarla
    const hashedPassword = await bcrypt.hash(result.data.password, 10); // Ajusta el nivel de salado según tus necesidades (10 es un buen balance)

    // Crear usuario en la base de datos junto con el token de verificación
    await prisma.user.create({
      data: {
        ...result.data, // Datos validados
        password: hashedPassword, // Sustituir la contraseña original por la cifrada
        verificationTokens: {
          create: {
            token, // Token generado
            type: "EMAIL_VERIFICATION", // Tipo de token
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // Expira en 24 horas
          },
        },
      },
    });

    // Enviar correo con el token de verificación
    await sendVerificationEmail(result.data.email, token);

    return { success: true };
  } catch (error: unknown) {
    // Verificamos si el error tiene la propiedad `code` y si es P2002 (error de restricción única)
    if (error instanceof Error && "code" in error && (error as any).code === "P2002") {
      const prismaError = error as { code: string; meta?: any };
      // Verificamos si el error es por correo duplicado
      if (prismaError.meta?.target?.includes("email")) {
        return {
          errors: [
            {
              path: ["email"],
              message: "El correo ya está registrado. Por favor, utiliza otro.",
            },
          ],
        };
      }
    }

    return {
      errors: [
        {
          path: ["general"],
          message: "Ocurrió un error inesperado. Inténtalo de nuevo más tarde.",
        },
      ],
    };
  }
}
