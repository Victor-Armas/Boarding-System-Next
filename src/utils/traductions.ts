
export const statusMapping: Record<string, string> = {
  PENDING_DOWNLOAD: "Pendiente",
  DOWNLOADING: "En descarga",
  VALIDATING: "En validación",
  CAPTURING: "En captura",
  COMPLETED: "Completado",
};

export const bannerStatusMapping: Record<string, string> = {
  PENDING_DOWNLOAD: "Esperando Rampa",
  DOWNLOADING: "En Descarga",
  VALIDATING: "En Validación",
  CAPTURING: "En Captura",
  COMPLETED: "Completado",
};

export const StatusMappingEFD: Record<string, string> = {
  PENDING: "Pendiente",
  IN_PROCESS: "En proceso",
  COMPLETED: "Solucionado",
};

export const statusStylesEFD: Record<string, string> = {
  PENDING: "bg-yellow-500 ", 
  IN_PROCESS: "bg-blue-500 ",
  COMPLETED: "bg-green-500 ",
};


export const statusStyles: Record<string, string> = {
  PENDING_DOWNLOAD: "bg-yellow-500",
  DOWNLOADING: "bg-blue-500",
  VALIDATING: "bg-purple-400",
  CAPTURING: "bg-green-500",
  COMPLETED: "bg-green-700",
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