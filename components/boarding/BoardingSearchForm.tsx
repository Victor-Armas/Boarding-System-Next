"use client";

import { useRouter } from "next/navigation";
import {useState } from "react";


export default function BoardingSearchForm() {
 
  const router = useRouter();
  // Estado local para manejar los filtros
  const [filters, setFilters] = useState({
    numberBox: "",
    supplier: "",
    date: "",
    status: "",
  });

  // Manejo de cambios en los inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Enviar filtros como query params y refrescar dinámicamente
  const handleSearch = () => {
    const query = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value.trim() !== "")
    );

    router.push(`?${new URLSearchParams(query).toString()}`);
  };

  return (
    <div className="flex justify-end mt-20">
      <form className="flex flex-wrap gap-4">
        {/* Campo Número de caja */}
        <input
          type="text"
          name="numberBox"
          value={filters.numberBox}
          onChange={handleInputChange}
          placeholder="Número de caja"
          className="border p-2"
        />
        {/* Campo Proveedor */}
        <input
          type="text"
          name="supplier"
          value={filters.supplier}
          onChange={handleInputChange}
          placeholder="Proveedor"
          className="border p-2"
        />
        {/* Campo Fecha */}
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleInputChange}
          className="border p-2"
        />
        {/* Campo Estado */}
        <select
          name="status"
          value={filters.status}
          onChange={handleInputChange}
          className="border p-2"
        >
          <option value="">--Seleccione un Estado--</option>
          <option value="PENDING_DOWNLOAD">Pendiente de Descarga</option>
          <option value="DOWNLOADING">En descarga</option>
          <option value="VALIDATING">En Validación</option>
          <option value="CAPTURING">En captura</option>
          <option value="COMPLETED">Completado</option>
        </select>
        {/* Botón Buscar */}
        <button
          type="button"
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2"
        >
          Buscar
        </button>
      </form>
    </div>
  );
}
