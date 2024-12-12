import React from "react";

export default function UserCreateForm() {
  return (
    <>
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
            className="mt-1 p-3 w-full border border-gray-300 rounded-md"
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
            className="mt-1 p-3 w-full border border-gray-300 rounded-md"
            placeholder="Ingresa un correo electronico"
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
            className="mt-1 p-3 w-full border border-gray-300 rounded-md"
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
          className="mt-1 p-3 w-full border border-gray-300 rounded-md"
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
          className="mt-1 p-3 w-full border border-gray-300 rounded-md"
        >
            <option value="">-- Seleccione --</option>
            <option value="BUYER">Comprador</option>
            <option value="COORDINATOR">Coordinador</option>
            <option value="ASSISTANT">Capturista</option>
            <option value="ADMIN">Administrador</option>
        </select>
      </div>
    </>
  );
}
