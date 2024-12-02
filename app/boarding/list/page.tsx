
import { prisma } from "@/src/lib/prisma";
import PaginationButtons from "@/components/ui/PaginationButtons";
import Heading from "@/components/ui/Heading";
import NavButtonPagination from "@/components/ui/NavButtonPagination";
import BoardingSearchForm from "@/components/boarding/BoardingSearchForm";
import { getBoardings } from "@/actions/filter-boarding-list-action";
import BoardingTableClient from "@/components/boarding/BoardingTableClient";


const ITEMS_PER_PAGE = 10;


export default async function ListBoardingPage({searchParams,}: {searchParams: Record<string, string | undefined>;}) {
  // Convertimos `searchParams` en una Promise y la esperamos
  const params = await searchParams;
  const page = parseInt(params?.page || "1", 10);

  const filters = {
    numberBox: params?.numberBox || "",
    supplier: params?.supplier || "",
    date: params?.date || "",
    status: params?.status || "",
  };

  const { boardings, totalCount } = await getBoardings(filters, page);
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Obtener el id de boarding si está presente en los searchParams (query string)
  const boardingId = params?.id;

  // Si el id está presente, obtén los detalles del boarding
  let boardingDetails = null;
  if (boardingId) {
    boardingDetails = await prisma.boarding.findUnique({
      where: { id: parseInt(boardingId as string) },
    });
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading>Listado de Embarques</Heading>
        <NavButtonPagination link="/boarding" text="Menu Principal" />
      </div>

      {/* Formulario de búsqueda */}
      <BoardingSearchForm />

      {/* Tabla con los datos */}
      <BoardingTableClient boardings={boardings} />

      {/* Botones de paginación */}
      <PaginationButtons currentPage={page} totalPages={totalPages} />
    </>
  );
}
