"use server";

import { prisma } from "@/src/lib/prisma";
import { LoginSchema } from "@/src/schema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function loginUser({ email, password }: { email: string; password: string }) {
  // Validar los datos de entrada
  const result = LoginSchema.safeParse({ email, password }); // Validar directamente con Zod
  if (!result.success) {
    return {
      errors: result.error.issues,
    };
  }

  // Buscar al usuario en la base de datos
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return {
      errors: [{ message: "Usuario no encontrado" }],
    };
  }

  // Verificar si el usuario está verificado
  if (!user.isVerified) {
    return {
      errors: [{ message: "Usuario no verificado" }],
    };
  }

  // Verificar la contraseña
  const isPasswordValid = await bcrypt.compare(password, user.password); // No necesitas `.trim()` aquí si aseguras datos limpios al registrarlos
  if (!isPasswordValid) {
    return {
      errors: [{ message: "Contraseña incorrecta" }],
    };
  }

  console.log("JWT_SECRET:", process.env.JWT_SECRET);

  // Generar el token
  const token = jwt.sign(
    { userId: user.id, role: user.role, name: user.name }, // Incluimos el rol en la carga útil
    process.env.JWT_SECRET as string,
    { expiresIn: "90d" }
  );

  console.log("JWT_SECRET:", process.env.JWT_SECRET);

  // Devolver el token
  return { token };
}
