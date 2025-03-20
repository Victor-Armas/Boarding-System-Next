import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function AreaProblemType() {
  const { data, error } = useSWR('/boarding/dashboard/api?type=issueResolutionTime', fetcher,{
      refreshInterval: 1000,
      revalidateOnFocus: false,
  });

  if (error) return <div>Error al cargar los datos</div>;
  if (!data) return <div>Cargando...</div>;

  return (
    <div className="w-full">
        <div className='bg-blue-500 bg-opacity-30  p-2 text-center '>
            <h2 className="text-xl font-semibold text-blue-800">Promedio de días para resolver problemas</h2>
        </div>
      <div className="overflow-x-auto bg-white shadow-lg rounded-b-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="border-b font-bold">
              <th className="px-4 py-2 text-left text-sm text-gray-600">Tipo de Problema</th>
              <th className="px-4 py-2 text-left text-sm text-gray-600">Promedio de Días</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item: { type: string; averageDays: number }) => (
              <tr key={item.type} className="border-b">
                <td className="px-4 py-2 text-sm text-gray-700">{item.type}</td>
                <td className={`px-4 py-2 text-sm font-semibold ${item.averageDays <= 3 ? 'text-green-600' : 'text-red-600'}`}>
                {(item.averageDays ?? 0).toFixed(2)} días
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
