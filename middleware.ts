import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Define los roles válidos y sus rutas restringidas
type Role = "BUYER" | "ASSISTANT" | "COORDINATOR";

const restrictedRoutes: Record<Role, string[]> = {
  BUYER: ["/boarding/create", "/boarding/create-user", "/boarding/edit/:id"],
  ASSISTANT: ["/boarding/create-user"],
  COORDINATOR: ["/boarding/create-user"],
};

// Función para comprobar si una ruta coincide con las restringidas
function isRestricted(role: Role, path: string): boolean {
  const routes = restrictedRoutes[role] || [];
  return routes.some((route) => {
    const routeRegex = new RegExp(`^${route.replace(/:\w+/g, "\\w+")}$`);
    return routeRegex.test(path);
  });
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;

  // Si no hay token, redirige al login
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  try {
    // Verificar el token JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
    const { payload }: any = await jwtVerify(token, secret);

    const userRole: Role = payload.role; // Extraer el rol del token
    const currentPath = request.nextUrl.pathname;

    // Verificar si el usuario tiene restricciones en la ruta actual
    if (isRestricted(userRole, currentPath)) {
      return NextResponse.rewrite(new URL("/not-found", request.url));
    }

    return NextResponse.next(); // Continuar si no hay restricciones
  } catch (error) {
    console.error("Error al verificar el token:", error);
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

// Configuración para aplicar el middleware a rutas específicas
export const config = {
  matcher: ["/boarding/:path*"],
};
