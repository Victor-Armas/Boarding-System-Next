import { BannerProblems } from '@/src/types';
import { bannerStatusMapping } from '@/src/utils/traductions';
import { FaRegSmile } from "react-icons/fa";
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProblemBanner() {
    const { data: issues, error } = useSWR<BannerProblems[]>(
      '/boarding/dashboard/api?type=issues',
      fetcher,{
        refreshInterval: 1000,
        revalidateOnFocus: false,
      }
    );
  
    const hasIssues = issues && issues.length > 0;
  
    if (error) {
      return (
        <div className="flex items-center justify-center h-12 w-full bg-red-600 text-white font-bold">
          Error al cargar problemas
        </div>
      );
    }
  
    return (
      <div
        className={`relative flex flex-col items-center justify-center h-28 rounded-t-lg w-full overflow-hidden ${
          hasIssues ? 'bg-white py-4' : 'bg-teal-500'
        }`}
      >
        {hasIssues ? (
          <div className="relative w-full h-full overflow-hidden flex items-center">
            <div
              className="absolute flex items-center whitespace-nowrap animate-scroll space-x-6"
            >
              {issues.map((issue) => (
                <div
                  key={issue.id}
                  className="bg-red-600 bg-opacity-90 rounded-lg px-6 py-3 max-w-full mr-6"
                >
                  <h3 className="font-bold text-white text-lg">Caja: {issue.boarding.boxNumber}</h3>
                  <p className="text-white font-semibold text-opacity-80 text-sm">
                    Estatus: {`${bannerStatusMapping[issue.state]} `}
                  </p>
                  <p className="text-white font-semibold text-sm">{issue.description}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-white font-bold flex flex-col lg:flex-row items-center">
              <p className="pr-5 text-2xl">Sin problemas reportados</p>
              <FaRegSmile className="text-4xl" />
            </div>

        )}
      </div>
    );
  }
