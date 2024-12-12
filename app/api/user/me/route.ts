import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Esta función se ejecuta cuando se hace una solicitud GET a /api/user/me
export async function GET(request: NextRequest) {
  // Obtener el token de las cookies
  const token = request.cookies.get("authToken")?.value;  // Accede al valor de la cookie

  if (!token) {
    // Si no hay token, devolver error 401 (no autorizado)
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  try {
    // Verificar el token con el secreto
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    // Si el token es válido, devolver la información del usuario (ej. su rol)
    return NextResponse.json({
      message: "Usuario autenticado",
      role: decoded.role, // Asumiendo que el rol está dentro del JWT
      userId: decoded.userId, // Puedes incluir otros datos como el ID del usuario
    });
  } catch (error) {
    console.error("Error al verificar el token:", error);

    // Si el token es inválido o ha expirado, devolver error 401 (no autorizado)
    return NextResponse.json({ message: "Token inválido o expirado" }, { status: 401 });
  }
}
