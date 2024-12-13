import EditBoardingForm from '@/components/boarding/EditBoardingForm';
import Heading from '@/components/ui/Heading';
import NavButtonPagination from '@/components/ui/NavButtonPagination';
import { prisma } from '@/src/lib/prisma';

type PageProps = {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {

 // Esperar a que 'params' sea resuelto
 const resolvedParams = await params;
  
 // Convertir el id a número
 const id = parseInt(resolvedParams.id, 10);

 if (isNaN(id)) {
   return <div>ID inválido</div>;
 }

  // Consultar el embarque en la base de datos
  const boarding = await prisma.boarding.findUnique({
    where: { id },
    include: {
      supplier: true,
      validator: true,
      forkliftOperator: true,
      assistant: true,
      ramp: true,
    },
  });

  if (!boarding) {
    return <div>El embarque no existe.</div>;
  }

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-10">
          <div>
            <Heading>Actualización de Embarque</Heading>
          </div>
          <div className="grid grid-cols-2 gap-6 text-center">
            <NavButtonPagination link="/boarding" text="Menú Principal" />
            <NavButtonPagination link="/boarding/list" text="Regresar" className="bg-fuchsia-600" />
          </div>
        </div>

        {/* Pasar datos del embarque al formulario */}
        <EditBoardingForm boarding={boarding} />
      </div>
    </>
  );
}
