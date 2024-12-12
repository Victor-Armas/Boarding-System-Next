"use client";

import { createUser } from "@/actions/create-user-action";
import { UserSchema } from "@/src/schema";
import React from "react";
import { toast } from "react-toastify";

export default function AddUserCreateForm() {
  const handleSubmit = async (formData: FormData) => {
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      store: formData.get("store"),
      role: formData.get("role"),
    };

    const result = UserSchema.safeParse(data);
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        toast.error(issue.message);
      });
      return;
    }

    const response = await createUser(result.data);

    if (response?.errors) {
      response.errors.forEach((issue) => {
        toast.error(issue.message);
      });
      return;
    }

    toast.success("Usuario creado correctamente");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Crear Usuario
        </h2>
        <form
          action={handleSubmit}
          className="space-y-4"
        >
          {/* Nombre */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-600"
            >
              Nombre
            </label>
            <input
              id="name"
              type="text"
              name="name"
              className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
              placeholder="Ingresa el nombre"
            />
          </div>

          {/* Correo electrónico */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
              placeholder="Ingresa un correo electrónico"
            />
          </div>

          {/* Contraseña */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
              placeholder="Ingresa una contraseña"
            />
          </div>

          {/* Bodega */}
          <div>
            <label
              htmlFor="store"
              className="block text-sm font-medium text-gray-600"
            >
              Selecciona una Planta
            </label>
            <select
              id="store"
              name="store"
              className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
            >
              <option value="">-- Seleccione --</option>
              <option value="RYDER9">Ryder 9</option>
              <option value="PLANTG">Planta G</option>
            </select>
          </div>

          {/* Rol */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-600"
            >
              Rol del usuario
            </label>
            <select
              id="role"
              name="role"
              className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
            >
              <option value="">-- Seleccione --</option>
              <option value="BUYER">Comprador</option>
              <option value="COORDINATOR">Coordinador</option>
              <option value="ASSISTANT">Capturista</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>

          {/* Botón */}
          <div>
            <input
              type="submit"
              className="bg-blue-600 hover:bg-blue-800 text-white w-full mt-6 p-3 rounded-md font-semibold cursor-pointer"
              value="Crear Usuario"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
