"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Importar desde next/navigation
import { toast } from "react-toastify";
import Cookies from "js-cookie"; // Importar js-cookie
import { loginUser } from "@/actions/login.action"; // Acciones de login
import { UserLoginForm } from "@/src/schema";
import Image from "next/image";

export default function Login() {
  const [form, setForm] = useState<UserLoginForm>({ email: "", password: "" });
  const router = useRouter();

  useEffect(() => {
    // Verificar si ya hay un authToken en las cookies
    const token = document.cookie.split("; ").find(row => row.startsWith("authToken="));
    if (token) {
      // Si el token existe, redirigir al usuario a la página principal (o una página protegida)
      router.push("/boarding");
    }
  }, [router]); // El efecto solo se ejecuta cuando el componente se monta

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Por favor, completa todos los campos");
      return;
    }

    try {
      // Normalizar el correo a minúsculas
      const normalizedEmail = form.email.trim().toLowerCase();

      // Llamar a la función de login
      const response = await loginUser({
        email: normalizedEmail,
        password: form.password
      });

      // Verificar si la respuesta contiene un token
      if (response.token) {
        // Guardar el token en una cookie
        Cookies.set("authToken", response.token, {
          secure: process.env.NODE_ENV === "production", // Usar HTTPS en producción
          sameSite: "strict", // Prevenir CSRF
          expires: 90, // Expira en 90 días
        });

        // Guardar el mensaje del toast en localStorage (esto no cambia)
        localStorage.setItem("loginMessage", "Inicio de sesión exitoso");

        // Redirigir a /boarding
        router.push("/boarding");
      } else {
        // Si no hay token, muestra los errores
        response.errors?.forEach((error) => toast.error(error.message));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-500 via-pink-600 to-red-800">
      <div className="hidden sm:block sm:w-1/2 lg:w-2/5 relative max-w-full">
        <Image
          src="/images/login-bg.jpg"
          alt="Fondo de login"
          layout="responsive" // Mantener el tamaño responsivo
          width={1000}    // Ancho relativo de la imagen
          height={1000}   // Alto relativo de la imagen
          className="rounded-l-xl object-cover"
          priority
        />
      </div>
  
      <div className="w-full sm:w-1/2 lg:w-2/5 p-8 bg-white rounded-r-xl shadow-xl flex flex-col justify-center max-w-md sm:max-w-lg lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Bienvenido de nuevo
        </h2>
  
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Ingresa tu correo electrónico"
            />
          </div>
  
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Ingresa tu contraseña"
            />
          </div>
  
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-md transition duration-200"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}