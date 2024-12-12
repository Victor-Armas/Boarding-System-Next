// "use client";


// import { useState } from "react";
// import { Boarding } from "@prisma/client";
// import { useRouter } from "next/navigation";
// import { PencilSquareIcon, CalendarIcon, UserIcon, ArchiveBoxIcon} from '@heroicons/react/24/outline';

// type EditBoardingFormProps = {
//   boardingId: Boarding['id'];
//   initialValues: Boarding;
// };

// export default function EditBoardingForm({ boardingId, initialValues }: EditBoardingFormProps) {
//   const router = useRouter();

//   // Estado del formulario, inicializado con los valores iniciales (formateando la fecha)
//   const [formData, setFormData] = useState({
//     ...initialValues,
//     dateTime: initialValues.arrivalDate ? initialValues.arrivalDate.toISOString().slice(0, 16) : "", // Formato 'yyyy-MM-ddTHH:mm'
//   });

//   // Estado para manejar los errores
//   const [errors, setErrors] = useState<any>({});

//   // Función para manejar cambios en los campos del formulario
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value, type, checked } = e.target as HTMLInputElement;;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   // Validación simple de los campos
//   const validateForm = () => {
//     const newErrors: any = {};

//     if (!formData.boxNumber) newErrors.numberBox = "El número de caja es obligatorio.";
//     if (!formData.dateTime) newErrors.dateTime = "La fecha y hora son obligatorios.";

//     // Validación para los campos obligatorios
//     const requiredFields = ["operator", "validator", "capturist", "supplier"];
//     requiredFields.forEach((field) => {
//       if (!formData[field as keyof typeof formData]) {
//         newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} es obligatorio.`;
//       }
//     });

//     return newErrors;
//   };

//   // Función para manejar el envío del formulario
//   // const handleSubmit = async (e: React.FormEvent) => {
//   //   e.preventDefault();

//   //   // Validar el formulario
//   //   const formErrors = validateForm();
//   //   setErrors(formErrors);

//   //   if (Object.keys(formErrors).length > 0) return; // Si hay errores, no enviamos el formulario

//   //   // Construir los datos para actualizar
//   //   const data = {
//   //     numberBox: formData.boxNumber,
//   //     dateTime: formData.dateTime ? new Date(formData.dateTime).toISOString() : null,
//   //     boxId: formData.id,
//   //     operator: formData.opera,
//   //     validator: formData.validator,
//   //     capturist: formData.capturist,
//   //     supplier: formData.supplier,
//   //     pallets: formData.pallets,
//   //     comments: formData.comments,
//   //     perforations: formData.perforations,
//   //     documentation: formData.documentation,
//   //     security: formData.security,
//   //     status: formData.status,
//   //   };

//   //   // Llamada a la función de actualización
//   //   const response = await updateBoarding(boardingId, data);

//   //   if (response?.errors) {
//   //     response.errors.forEach((issue) => {
//   //       toast.error(issue.message);
//   //     });
//   //     return;
//   //   }

//   //   // Notificación de éxito y redirección a la lista de embarques
//   //   toast.success("Embarque actualizado correctamente");
//   //   router.push("/boarding/list");
//   // };

//   const handleSubmit = async (e: React.FormEvent) =>{
//     console.log("Edit")
//   }

//   return (
//     <div className="bg-white mt-20 px-6 py-8 rounded-xl shadow-xl max-w-6xl mx-auto">
//       <form onSubmit={handleSubmit} className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
    
//         {/* Número de Caja */}
//         <div className="space-y-2 flex flex-col relative">
//           <div className="flex items-center space-x-2">
//             <PencilSquareIcon className="h-6 w-6 text-blue-600" />
//             <label htmlFor="numberBox" className="text-lg sm:text-xl font-semibold text-gray-700">Número de Caja</label>
//           </div>
//           <input
//             id="numberBox"
//             name="numberBox"
//             value={formData.boxNumber}
//             onChange={handleChange}
//             className="border-2 border-gray-300 focus:border-blue-500 p-4 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//           />
//           {errors.numberBox && (
//             <p className="mt-1 text-red-600 bg-red-100 border-l-4 border-red-500 text-sm py-2 px-4 rounded-md">
//               {errors.numberBox}
//             </p>
//           )}
//         </div>
    
//         {/* Fecha y Hora */}
//         <div className="space-y-2 flex flex-col relative">
//           <div className="flex items-center space-x-2">
//             <CalendarIcon className="h-6 w-6 text-blue-600" />
//             <label htmlFor="dateTime" className="text-lg sm:text-xl font-semibold text-gray-700">Fecha y Hora</label>
//           </div>
//           <input
//             id="dateTime"
//             name="dateTime"
//             type="datetime-local"
//             value={formData.dateTime}
//             onChange={handleChange}
//             className="border-2 border-gray-300 focus:border-blue-500 p-4 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//           />
//           {errors.dateTime && (
//             <p className="mt-1 text-red-600 bg-red-100 border-l-4 border-red-500 text-sm py-2 px-4 rounded-md">
//               {errors.dateTime}
//             </p>
//           )}
//         </div>
    
//         {/* Otros campos */}
//         {["operator", "validator", "capturist", "supplier"].map((field) => (
//           <div key={field} className="space-y-2 flex flex-col relative">
//             <div className="flex items-center space-x-2">
//               <UserIcon className="h-6 w-6 text-blue-600" />
//               <label htmlFor={field} className="text-lg sm:text-xl font-semibold text-gray-700">
//                 {field.charAt(0).toUpperCase() + field.slice(1)}
//               </label>
//             </div>
//             <input
//               id={field}
//               name={field}
//               type="text"
//               value={String(formData[field as keyof typeof formData] ?? "")}
//               onChange={handleChange}
//               className="border-2 border-gray-300 focus:border-blue-500 p-4 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//             />
//             {errors[field as keyof typeof formData] && (
//               <p className="mt-1 text-red-600 bg-red-100 border-l-4 border-red-500 text-sm py-2 px-4 rounded-md">
//                 {field === 'operator' && "El operador es obligatorio."}
//                 {field === 'validator' && "El validador es obligatorio."}
//                 {field === 'capturist' && "El capturista es obligatorio."}
//                 {field === 'supplier' && "El proveedor es obligatorio."}
//               </p>
//             )}
//           </div>
//         ))}
    
//         {/* Booleans */}
//         <div className="space-y-4 col-span-3 flex flex-col">
//           {["perforations", "documentation", "security"].map((field) => (
//             <div key={field} className="flex items-center space-x-3">
//               <input
//                 id={field}
//                 name={field}
//                 type="checkbox"
//                 checked={!!formData[field as keyof typeof formData]}
//                 onChange={handleChange}
//                 className="h-6 w-6 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 transition"
//               />
//               <label htmlFor={field} className="text-lg sm:text-xl font-semibold text-gray-700">
//                 {field.charAt(0).toUpperCase() + field.slice(1)}
//               </label>
//             </div>
//           ))}
//         </div>
    
//         {/* Estatus */}
//         <div className="space-y-2 flex flex-col relative">
//           <div className="flex items-center space-x-2">
//             <ArchiveBoxIcon className="h-6 w-6 text-blue-600" />
//             <label htmlFor="status" className="text-lg sm:text-xl font-semibold text-gray-700">Estatus</label>
//           </div>
//           <select
//             id="status"
//             name="status"
//             value={formData.status}
//             onChange={handleChange}
//             className="border-2 border-gray-300 focus:border-blue-500 p-4 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//           >
//             <option value="PENDING_DOWNLOAD">Pendiente de Descarga</option>
//             <option value="DOWNLOADING">En descarga</option>
//             <option value="VALIDATING">En Validación</option>
//             <option value="CAPTURING">En Captura</option>
//             <option value="COMPLETED">Completado</option>
//           </select>
//           {errors.status && (
//             <p className="mt-1 text-red-600 bg-red-100 border-l-4 border-red-500 text-sm py-2 px-4 rounded-md">
//               {errors.status}
//             </p>
//           )}
//         </div>
    
//         {/* Botón Enviar */}
//         <div className="flex justify-center col-span-3 mt-10">
//           <button
//             type="submit"
//             className="w-full bg-yellow-500 text-white py-4 px-8 rounded-lg shadow-md hover:bg-yellow-600 focus:ring-4 focus:ring-yellow-300 transition md:w-[40%] md:py-4 md:px-2"
//           >
//             Guardar Cambios
//           </button>
//         </div>
//       </form>
//     </div>
//   );
  
  

  
  

  
// }
