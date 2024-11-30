"use server"
import { prisma } from "@/src/lib/prisma";

// Función para obtener los datos de embarques
const ITEMS_PER_PAGE = 10;
export async function getBoardings(filters: Record<string, string>, page: number) {
    const skip = (page - 1) * ITEMS_PER_PAGE;
  
    const where: any = {};
  
    if (filters.numberBox) where.numberBox = { contains: filters.numberBox };
    if (filters.supplier) where.supplier = { contains: filters.supplier };
    if (filters.date) {
      const dateStart = new Date(filters.date); // Convertir la fecha seleccionada (en formato 'YYYY-MM-DD')
      
      // Ajustamos la fecha para la zona horaria local
      const localOffset = dateStart.getTimezoneOffset();  // Diferencia en minutos respecto a UTC
      dateStart.setMinutes(dateStart.getMinutes() + localOffset); // Ajustar la fecha para la zona horaria local
    
      // Establecer la hora a las 00:00:00 (inicio del día)
      dateStart.setHours(0, 0, 0, 0);
      
      const dateEnd = new Date(dateStart); // Crear una nueva fecha para el final del día
      dateEnd.setHours(23, 59, 59, 999); // Establecer la hora al final del día
    
      where.dateTime = {
        gte: dateStart, // Mayor o igual a la fecha de inicio (00:00:00)
        lte: dateEnd,   // Menor o igual a la fecha de fin (23:59:59)
      };
    }
    if (filters.status) where.status = filters.status;
  
    const [boardings, totalCount] = await Promise.all([
      prisma.boarding.findMany({
        where,
        skip,
        take: ITEMS_PER_PAGE,
        orderBy: { dateTime: "desc" },
      }),
      prisma.boarding.count({ where }),
    ]);
  
    return { boardings, totalCount };
  }