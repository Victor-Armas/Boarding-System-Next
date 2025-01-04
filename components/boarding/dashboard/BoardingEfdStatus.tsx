import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function BoardingEfdStatus() {
  const { data, error } = useSWR('/boarding/dashboard/api?type=boardingEfdStatus', fetcher,{
      refreshInterval: 1000,
      revalidateOnFocus: false,
  });

  if (error) return <div>Error al cargar los datos</div>;
  if (!data) return <div>Cargando...</div>;

  return (
    <div className="">
        <div className='bg-blue-500 bg-opacity-30 flex justify-center p-1 '>
            <h2 className="text-xl font-semibold text-blue-800">Semaforo de EFD No Resueltos</h2>
        </div>
      <div className="grid grid-cols-3 gap-4 p-6 bg-white">
        <div className="flex flex-col items-center justify-center p-4 bg-green-500 text-white rounded-lg text-center">
          <span className="text-2xl font-bold">{data.verde}</span>
          <span className="">{data.verde === 0
            ? ''
            : data.verde <= 3
            ? "EFD'S Activos"
            : "EFD'S Acumulados"}
        </span>
        </div>
        <div className="flex flex-col items-center justify-center p-4 bg-yellow-500 text-white rounded-lg text-center">
          <span className="text-2xl font-bold">{data.amarillo}</span>
          <span className="">{data.amarillo === 0
            ? ''
            : data.amarillo <= 3
            ? "EFD'S Activos"
            : "RESOLVER EFD'S"}</span>
        </div>
        <div className="flex flex-col items-center justify-center p-4 bg-red-500 text-white rounded-lg">
          <span className={`font-bold ${data.rojo >= 4 ? 'text-3xl' : 'text-xl '}`}>{data.rojo}</span>
          <span className={`${data.rojo >= 4 ? 'font-extrabold' : 'font-semibold'}`}> {data.rojo === 0
            ? ''
            : data.rojo <= 3
            ? "Analizar EFD'S"
            : "¡URGENTE RESOLVER!"}</span>
        </div>
      </div>
    </div>
  );
}
