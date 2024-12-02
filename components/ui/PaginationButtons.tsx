"use client";

import { useRouter } from "next/navigation";

export default function PaginationButtons({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const router = useRouter();

  const goToPage = (page: number) => {
    router.push(`/boarding/list?page=${page}`);
  };

  return (
    <div className="flex justify-between mt-10">
      <button
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        disabled={currentPage <= 1}
        onClick={() => goToPage(currentPage - 1)}
      >
        Anterior
      </button>
      <span>
        Página {currentPage} de {totalPages}
      </span>
      <button
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        disabled={currentPage >= totalPages}
        onClick={() => goToPage(currentPage + 1)}
      >
        Siguiente
      </button>
    </div>
  );
}
