import { prisma } from "@/src/lib/prisma";


async function getBoxs(){
  return await prisma.box.findMany()
}

export default async function BoardingForm() {

  const boxs = await getBoxs()

  return (
    <>
      {/* PRIMERA SECCION */}

      <div className="md:flex md:justify-around gap-6">
        <div className="md:w-1/3">
          <label className="text-slate-800 font-semibold" htmlFor="numberBox">
            Numero de Caja:
          </label>
          <input
            id="numberBox"
            type="text"
            name="numberBox"
            className="block w-full p-3 bg-slate-100"
            placeholder="Numero de Caja"
          />
        </div>

        <div className="md:w-1/3">
          <label className="text-slate-800 font-semibold" htmlFor="dateTime">
            Fecha y Hora:
          </label>
          <input
            id="dateTime"
           type="datetime-local"
            name="dateTime"
            className="block w-full p-3 bg-slate-100"
          />
        </div>

        <div className="md:w-1/3">
          <label className="text-slate-800 font-semibold" htmlFor="boxId">
            Tipo de Tansporte:
          </label>
          <select
            className="block w-full p-3 bg-slate-100"
            id="boxId"
            name="boxId"
          >
            <option value="">-- Seleccione --</option>
            {boxs.map(box => (
              <option
                key={box.id}
                value={box.id}
              >{box.name}</option>
            ))}
          </select>
        </div>



      </div>
      {/* SEGUNDA SECCION  */}

      <div className="md:flex md:justify-around gap-6 mt-5">
        <div className="md:w-1/3">
          <label className="text-slate-800 font-semibold" htmlFor="operator">
            Montacarguista:
          </label>
          <input
            id="operator"
            type="text"
            name="operator"
            className="block w-full p-3 bg-slate-100"
            placeholder="Ingresa al Montacarguista"
          />
        </div>

        <div className="md:w-1/3">
          <label className="text-slate-800 font-semibold" htmlFor="validator">
            Validador:
          </label>
          <input
            id="validator"
            type="text"
            name="validator"
            className="block w-full p-3 bg-slate-100"
            placeholder="Ingresa al Validador"
          />
        </div>

        <div className="md:w-1/3">
          <label className="text-slate-800 font-semibold" htmlFor="capturist">
            Capturista:
          </label>
          <input
            id="capturist"
            type="text"
            name="capturist"
            className="block w-full p-3 bg-slate-100"
            placeholder="Ingresa al Capturista"
          />
        </div>
      </div>

      {/* TERCERA SECCION */}

      <div className="md:flex md:justify-around gap-6 mt-5">
        <div className="md:w-1/2">
          <div>
            <label className="text-slate-800 font-semibold" htmlFor="supplier">
              Proveedor:
            </label>
            <input
              id="supplier"
              type="text"
              name="supplier"
              className="block w-full p-3 bg-slate-100"
              placeholder="Nombre del Proveedor"
            />
          </div>

          <div className="mt-5">
            <label className="text-slate-800 font-semibold" htmlFor="pallets">
              Tarimas:
            </label>
            <input
              id="pallets"
              type="number"
              name="pallets"
              className="block w-full p-3 bg-slate-100"
              placeholder="Cantidad de Tarimas"
            />
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

      <h2 className=" uppercase font-semibold text-2xl text-center last-of-type:border-b-2 py-5">CheckList</h2>
      <div className="md:flex md:justify-around gap-6 mt-10">
        <div className="md:w-1/3">
          <div className="flex items-center ps-4 border border-gray-500 rounded hover:border-blue-600 hover:border-2">
            <input id="perforations" type="checkbox" value="on" name="perforations" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded" />
            <label htmlFor="perforations" className="w-full py-4 ms-2 text-sm font-medium text-gray-900">Existen Perforaciones</label>
          </div>
        </div>

        <div className="md:w-1/3">
          <div className="flex items-center ps-4 border border-gray-500 rounded hover:border-blue-600 hover:border-2">
            <input id="documentation" type="checkbox" value="on" name="documentation" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded" />
            <label htmlFor="documentation" className="w-full py-4 ms-2 text-sm font-medium text-gray-900">Tiene Documentacion Completa</label>
          </div>
        </div>

        <div className="md:w-1/3">
          <div className="flex items-center ps-4 border border-gray-500 rounded hover:border-blue-600 hover:border-2">
            <input id="security" type="checkbox" value="on" name="security" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded" />
            <label htmlFor="security" className="w-full py-4 ms-2 text-sm font-medium text-gray-900">Cuenta con cadena y/o bandas</label>
          </div>
        </div>
      </div>
    </>
  );
}
