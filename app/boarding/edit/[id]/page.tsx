
import EditBoardingForm from '@/components/boarding/EditBoardingForm';
import Heading from '@/components/ui/Heading'
import NavButtonPagination from '@/components/ui/NavButtonPagination'
import { prisma } from '@/src/lib/prisma'
import React from 'react'

export default async function  page({ params }: { params: { id: string } }) {
  const { id } = await params;

  const boarding = await prisma.boarding.findUnique({
    where: { id: parseInt(id, 10) },
  });

  if (!boarding) {
    return <div>El embarque no existe.</div>;
  }

  // Convertimos `dateTime` al formato requerido por `datetime-local`
  const formattedBoarding = {
    ...boarding,
    dateTime: new Date(boarding.dateTime), // yyyy-MM-ddTHH:mm
  };

    
  return (
    <>
        <div>
            <div className="flex items-center justify-between mb-10">
                <div>
                    <Heading>Actualizacion de Embarque</Heading>
                </div>
                <div className='grid grid-cols-2 gap-6 text-center '>
                    <NavButtonPagination link="/boarding" text="Menu Principal" />
                    <NavButtonPagination link="/boarding/list" text="Regresar"className="bg-fuchsia-600"/>
                </div>
            </div>

            <EditBoardingForm boardingId={boarding.id} initialValues={formattedBoarding} />
        </div>
    </>
  );
}
