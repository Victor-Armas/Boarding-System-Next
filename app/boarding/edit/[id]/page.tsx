// import EditBoardingForm from '@/components/boarding/EditBoardingForm';
// import Heading from '@/components/ui/Heading';
// import NavButtonPagination from '@/components/ui/NavButtonPagination';
// import { prisma } from '@/src/lib/prisma';
// import { BoardingId } from '@/src/types';
// import React from 'react';


// export default async function Page({ params }: BoardingId) {
//   // Desestructuramos el id de params
//   const { id } = params;

//   // Obtener el embarque desde la base de datos
//   const boarding = await prisma.boarding.findUnique({
//     where: { id: parseInt(id, 10) },
//   });

//   if (!boarding) {
//     return <div>El embarque no existe.</div>;
//   }

//   // Convertimos `dateTime` al formato requerido por `datetime-local`
//   const formattedBoarding = {
//     ...boarding,
//     dateTime: new Date(boarding.arrivalDate), // yyyy-MM-ddTHH:mm
//   };

//   return (
//     <>
//       <div>
//         <div className="flex items-center justify-between mb-10">
//           <div>
//             <Heading>Actualización de Embarque</Heading>
//           </div>
//           <div className="grid grid-cols-2 gap-6 text-center">
//             <NavButtonPagination link="/boarding" text="Menú Principal" />
//             <NavButtonPagination link="/boarding/list" text="Regresar" className="bg-fuchsia-600" />
//           </div>
//         </div>

//         <EditBoardingForm boardingId={boarding.id} initialValues={formattedBoarding} />
//       </div>
//     </>
//   );
// }

export default function page() {
  return (
    <div>page</div>
  )
}
