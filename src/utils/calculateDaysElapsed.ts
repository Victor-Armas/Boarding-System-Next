// Función para calcular días transcurridos
export const calculateDaysElapsed = (crateEfdDate: string): number => {
    const currentDate = Date.now();
    const createdDate = new Date(crateEfdDate).getTime();
    return Math.floor((currentDate - createdDate) / (1000 * 60 * 60 * 24));
  };