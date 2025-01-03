import React, { useState } from 'react';
import { format } from 'date-fns';
import useSWR from 'swr';
import { convertTimeToMonterrey } from '@/src/utils/convertTimeToMonterrey';

interface ProviderData {
  id: string;
  name: string;
  boardingCount: number;
  lastBoardingDate: string[];
}

const fetchProviders = (url: string) => fetch(url).then((res) => res.json());

export default function TopProvidersChart() {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const { data, error } = useSWR<ProviderData[]>(
    `/boarding/dashboard/api?startDate=${startDate || ''}&endDate=${endDate || ''}`,
    fetchProviders
  );

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  if (error) return <div className="text-red-500">Error loading data</div>;
  if (!data) return <div className="text-gray-500">Loading...</div>;


  return (
    <div className="overflow-hidden bg-white shadow-md rounded-lg">
      <h2 className=" pl-5 pt-3 text-lg font-medium mb-2 text-gray-600">Proveedores Frecuentes</h2>

      {/* Filtros por fecha */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 sm:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700 text-center"
            >
              Fecha de inicio
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={startDate}
              onChange={handleStartDateChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700 text-center"
            >
              Fecha de fin
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={endDate}
              onChange={handleEndDateChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
            />
          </div>
        </div>
      </div>

      {/* Tabla */}
      
        <div className="overflow-x-auto shadow-md  border border-gray-200">
          <table className="min-w-full table-auto divide-y divide-gray-200">
            <thead className="bg-indigo-100">
              <tr>
                <th className="px-6 py-1 text-center text-sm font-semibold text-indigo-800 uppercase">
                  Proveedor
                </th>
                <th className="px-6 py-1 text-center text-sm font-semibold text-indigo-800 uppercase">
                  Cantidad de Embarques
                </th>
                <th className="px-6 py-1 text-center text-sm font-semibold text-indigo-800 uppercase">
                  Último Embarque
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((provider) => (
                <tr
                  key={provider.id}
                  className="hover:bg-gray-50 transition duration-150 ease-in-out "
                >
                  <td className="px-6 py-3 text-sm font-medium text-gray-900 text-center">
                    {provider.name}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500 text-center">
                    {provider.boardingCount}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500 text-center">
                    {Array.isArray(provider.lastBoardingDate) &&
                      provider.lastBoardingDate.length > 0 ? (
                      format(
                        convertTimeToMonterrey(
                          new Date(
                            Math.max(
                              ...provider.lastBoardingDate.map((date) =>
                                new Date(date).getTime()
                              )
                            )
                          )
                        ),
                        'dd-MMM-yyyy'
                      )
                    ) : typeof provider.lastBoardingDate === 'string' ? (
                      format(
                        convertTimeToMonterrey(
                          new Date(provider.lastBoardingDate)
                        ),
                        'dd-MMM-yy'
                      )
                    ) : (
                      'No disponible'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      
    </div>

  );
}
