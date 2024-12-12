"use client";
import useSWR from "swr";
import { cajaTypeOptions } from "@/src/utils/traductions";
import {Ramp, Supplier} from "@prisma/client";

export default function BoardingForm() {
  const url = "/boarding/create/api";
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error, isLoading } = useSWR<{
    ramp: Ramp[];
    suppliers: Supplier[];
  }>(url, fetcher);

  if (isLoading) return <p>Cargando datos...</p>;
  if (error) return <p>Error al cargar los datos</p>;

  const { ramp: ramps, suppliers } = data || {};

  return (
    <>
      {/* PRIMERA SECCION */}
      <div className="md:flex md:justify-around gap-6">
        <div className="md:w-1/3">
          <label className="text-slate-800 font-semibold" htmlFor="boxNumber">
            Numero de Caja:
          </label>
          <input
            id="boxNumber"
            type="text"
            name="boxNumber"
            className="block w-full p-3 bg-slate-100"
            placeholder="Numero de Caja"
          />
        </div>

        <div className="md:w-1/3">
          <label className="text-slate-800 font-semibold" htmlFor="arrivalDate">
            Fecha y Hora:
          </label>
          <input
            id="arrivalDate"
            type="datetime-local"
            name="arrivalDate"
            className="block w-full p-3 bg-slate-100"
          />
        </div>

        <div className="md:w-1/3">
          <label className="text-slate-800 font-semibold" htmlFor="boxType">
            Tipo de Transporte:
          </label>
          <select
            className="block w-full p-3 bg-slate-100"
            id="boxType"
            name="boxType"
          >
            <option value="">-- Seleccione --</option>
            {cajaTypeOptions.map((box) => (
              <option key={box.value} value={box.value}>
                {box.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* SEGUNDA SECCION */}


      {/* TERCERA SECCION */}
      <div className="md:flex md:justify-around gap-6 mt-5">
        <div className="md:w-1/2">
          <div>
            <label className="text-slate-800 font-semibold" htmlFor="supplier">
              Proveedor:
            </label>
            <select className="block w-full p-3 bg-slate-100" id="supplier" name="supplier">
              <option value="">-- Seleccione --</option>
              {suppliers?.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5">
          <label className="text-slate-800 font-semibold" htmlFor="ramp">
            Rampa:
          </label>
          <select className="block w-full p-3 bg-slate-100" id="ramp" name="ramp" defaultValue="" >
            <option value="">--  Seleccione --</option>
            {ramps?.map((ramp) => (
              <option key={ramp.id} value={ramp.id}>
                {ramp.nameRamp}
              </option>
            ))}
          </select>
          </div>
        </div>

        <div className="md:w-1/2">
          <label className="text-slate-800 font-semibold" htmlFor="comments">
            Comentarios:
          </label>
          <textarea
            id="comments"
            name="comments"
            className="block w-full p-3 bg-slate-100 md:h-36"
          ></textarea>
        </div>
      </div>
    </>
  );
}
