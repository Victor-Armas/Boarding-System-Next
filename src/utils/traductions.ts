
export const statusMapping: Record<string, string> = {
  PENDING_DOWNLOAD: "Pendiente",
  DOWNLOADING: "En descarga",
  VALIDATING: "En validación",
  CAPTURING: "En captura",
  COMPLETED: "Completado",
};

export const statusStyles: Record<string, string> = {
  PENDING_DOWNLOAD: "bg-yellow-500 text-white",
  DOWNLOADING: "bg-blue-500 text-white",
  VALIDATING: "bg-purple-400 text-white",
  CAPTURING: "bg-green-500 text-white",
  COMPLETED: "bg-green-700 text-white",
};

export const statusStylesProblem: Record<string, string> = {
  PENDING_DOWNLOAD: "text-yellow-600",
  DOWNLOADING: "text-blue-600",
  VALIDATING: "text-purple-600",
  CAPTURING: "text-green-600",
  COMPLETED: "text-green-600",
};

export const cajaTypeOptions = [
  { value: 'CAMIONETA', label: 'Camioneta' },
  { value: 'TORTON', label: 'Torton' },
  { value: 'MARITIMO', label: 'Marítimo' },
  { value: 'CAJA_CERRADA', label: 'Caja Cerrada' },
  { value: 'FULL', label: 'Trailer' },
];

export const cajaTypeMap: Record<string, string> = {
  CAMIONETA: "Camioneta 3/2",
  TORTON: "Torton",
  MARITIMO: "Marítimo",
  CAJA_CERRADA: "Caja Cerrada",
  FULL: "Trailer",
};

export const supplierMapping: Record<string, string> = {
  
}