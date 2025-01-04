import { prisma } from '@/src/lib/prisma';
import { toZonedTime } from 'date-fns-tz';

export const dynamic = "force-dynamic"; // Fuerza el renderizado dinámico

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const type = searchParams.get('type'); // Parámetro para distinguir tipos de consulta

  const timeZone = 'America/Monterrey';
  const start = startDate ? toZonedTime(new Date(startDate), timeZone) : undefined;
  const end = endDate ? toZonedTime(new Date(endDate), timeZone) : undefined;


  if (end) {
    // Ajustamos el fin para que sea hasta el último minuto del día en Monterrey
    end.setHours(23, 59, 59, 999);
  }

  const dateFilter = {
    arrivalDate: {
      gte: start, // Fecha de inicio
      lte: end,   // Fecha de fin ajustada
    },
  };

  try {
    if (type === 'issues') {
      // Nueva lógica para consultar problemas reportados
      const issues = await prisma.boardingIssue.findMany({
        where: {
          createdAt: {
            gte: start, // Fecha de inicio
            lte: end,   // Fecha de fin
          },
          resolved: false
        },
        select: {
          id: true,
          description: true,
          state: true,
          createdAt: true,
          boarding: {
            select: {
              boxNumber: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc', // Ordenar por la fecha más reciente primero
        },
      });

      return Response.json(issues);
    } else if (type === 'durations') {
      // Lógica para el componente DurationChart
      const boardings = await prisma.boarding.findMany({
        where: dateFilter,
        select: {
          downloadDuration: true,
          validationDuration: true,
          captureDuration: true,
          timeUntilRamp: true,
        },
      });

      let totalDownloadDuration = 0;
      let totalValidationDuration = 0;
      let totalCaptureDuration = 0;
      let totalTimeUntilRamp = 0;
      let totalBoardings = 0;

      boardings.forEach((boarding) => {
        if (boarding.downloadDuration) totalDownloadDuration += boarding.downloadDuration;
        if (boarding.validationDuration) totalValidationDuration += boarding.validationDuration;
        if (boarding.captureDuration) totalCaptureDuration += boarding.captureDuration;
        if (boarding.timeUntilRamp) totalTimeUntilRamp += boarding.timeUntilRamp;
        totalBoardings++;
      });

      const durations = {
        avgDownloadDuration: totalBoardings > 0 ? totalDownloadDuration / totalBoardings : 0,
        avgValidationDuration: totalBoardings > 0 ? totalValidationDuration / totalBoardings : 0,
        avgCaptureDuration: totalBoardings > 0 ? totalCaptureDuration / totalBoardings : 0,
        avgTimeUntilRamp: totalBoardings > 0 ? totalTimeUntilRamp / totalBoardings : 0,
      };

      return Response.json({ durations });
    } else if (type === 'rampDemand') {
      // Lógica para calcular la demanda de rampas
      const rampUsage = await prisma.boarding.findMany({
        where: dateFilter,
        select: {
          arrivalDate: true, // Fecha de llegada
          rampId: true, // Rampa asignada
        },
      });

      const demandMap: Record<number, Record<number, number>> = {};

      rampUsage.forEach(({ arrivalDate, rampId }) => {
        if (!rampId) return; // Ignorar registros sin rampId

        const date = toZonedTime(arrivalDate, timeZone);
        const dayOfWeek = date.getDay(); // Día de la semana (0 = Domingo, 6 = Sábado)
        const hourOfDay = date.getHours(); // Hora del día (0-23)

        // Usar bloques de 2 horas
        const twoHourBlock = Math.floor(hourOfDay / 2);

        if (!demandMap[twoHourBlock]) {
          demandMap[twoHourBlock] = {};
        }

        if (!demandMap[twoHourBlock][dayOfWeek]) {
          demandMap[twoHourBlock][dayOfWeek] = 0;
        }

        demandMap[twoHourBlock][dayOfWeek]++;
      });

      // Formateamos los datos para el gráfico de calor
      const heatmapData = [];
      for (let x = 1; x <= 12; x++) { // 12 bloques de 2 horas (0-23 dividido por 2)
        for (let y = 1; y <= 7; y++) { // 7 días de la semana (0-6)
          const value = demandMap[x]?.[y] || 0; // Valor por defecto: 0
          heatmapData.push({ x, y, v: value });
        }
      }

      return Response.json(heatmapData);
    } else if (type === 'issueResolutionTime') {
      const currentDate = new Date();
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(currentDate.getMonth() - 2);

      const result = await prisma.problemTypeEfd.findMany({
        include: {
          efd: {
            where: {
              crateEfdDate: {
                gte: threeMonthsAgo,
                lte: currentDate,
              },
            },
            select: {
              daysElapsed: true,
            },
          },
        },
      });

      const data = result.map(problemType => {
        const averageDays =
          problemType.efd.reduce((sum, efd) => sum + (efd.daysElapsed || 0), 0) /
          problemType.efd.length;

        return {
          type: problemType.name,
          averageDays: parseFloat(averageDays.toFixed(2)), // Redondear a 2 decimales
        };
      });

      return Response.json(data);
    }

    else if (type === 'boardingEfdStatus') {
      const currentDate = new Date();

      // Obtener todos los BoardingEfd que aún no se han resuelto
      const result = await prisma.boardingEfd.findMany({
        where: {
          daysElapsed: null,  // Solo contar aquellos que no tienen días transcurridos (no resueltos)
        },
      });

      // Variables para contar los EFDs por estado
      let verdeCount = 0;  // Estado verde (0-2 días)
      let amarilloCount = 0;  // Estado amarillo (3-4 días)
      let rojoCount = 0;  // Estado rojo (5+ días)

      // Calcular los estados de cada BoardingEfd
      result.forEach((boardingEfd) => {
        const crateEfdDate = boardingEfd.crateEfdDate;
        const diffTime = currentDate.getTime() - crateEfdDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24)); // Días transcurridos desde la creación

        // Asignar el estado según los días transcurridos desde la creación
        if (diffDays <= 2) {
          verdeCount++;
        } else if (diffDays >= 3 && diffDays <= 4) {
          amarilloCount++;
        } else if (diffDays >= 5) {
          rojoCount++;
        }
      });

      // Devolver el conteo de EFDs por estado
      return Response.json({
        verde: verdeCount,
        amarillo: amarilloCount,
        rojo: rojoCount,
      });
    }

    else if (type === 'dailyDownloads') {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - 6); // Siete días antes de hoy
    
      // Obtener los embarques en los últimos 7 días
      const boardings = await prisma.boarding.groupBy({
        by: ['arrivalDate'],
        _count: {
          id: true,
        },
        where: {
          arrivalDate: {
            gte: startOfWeek,
            lte: today,
          },
        },
        orderBy: {
          arrivalDate: 'asc',
        },
      });
    
      // Definir los días de la semana, con el orden correcto: Viernes es 0, Sábado 1, etc.
      const daysOfWeek = ['Viernes', 'Sábado', 'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves'];
    
      // Inicializamos los contadores por día de la semana y las fechas correspondientes
      const dayCounts = daysOfWeek.map((day) => ({ day, count: 0, date: '' }));
    
      // Calcular la fecha para cada día de la semana, comenzando desde el Viernes
      const calculatedDates = daysOfWeek.map((_, index) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + index);
        return date;
      });
    
      // Asignar la fecha correspondiente a cada día
      dayCounts.forEach((dayCount, index) => {
        const date = calculatedDates[index];
        dayCount.date = date.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
      });
    
      // Contamos los embarques por día de la semana
      boardings.forEach((boarding) => {
        const dayIndex = new Date(boarding.arrivalDate).getDay();
        dayCounts[dayIndex].count += boarding._count.id;
      });
    
      // Obtener el día actual en español
      const currentDay = new Date().toLocaleString('es-ES', { weekday: 'long' }).toLowerCase();
    
      // Obtener el índice del día actual
      const todayIndex = daysOfWeek.findIndex(day => day.toLowerCase() === currentDay);
    
      // Reordenar los días de acuerdo al día actual
      const orderedDays = [
        ...dayCounts.slice(todayIndex + 1), // Los días después del día actual
        ...dayCounts.slice(0, todayIndex), // Los días antes del día actual
        dayCounts[todayIndex], // El día actual al final
      ];
    
      return Response.json(orderedDays);
    }
    

    else if (type === 'boardingsByStatus') {
      const boardingsByStatus = await prisma.boarding.groupBy({
        by: ['status'],
        _count: {
          id: true, // Contamos los embarques por estado
        },
        where: {
          status: {
            in: ['PENDING_DOWNLOAD', 'DOWNLOADING', 'VALIDATING', 'CAPTURING', 'COMPLETED'],
          },
        },
      });
    
      // Procesar los resultados para que puedas usarlos en la respuesta
      const result = {
        PENDING_DOWNLOAD: 0,
        DOWNLOADING: 0,
        VALIDATING: 0,
        CAPTURING: 0,
        COMPLETED: 0,
      };
    
      // Asignamos los conteos de cada estado
      boardingsByStatus.forEach((boarding) => {
        result[boarding.status] = boarding._count.id;
      });
    
      return Response.json(result);
    }
    


    else {
      // Lógica original para obtener proveedores
      const providers = await prisma.supplier.findMany({
        where: {
          boardings: {
            some: dateFilter, // Aplicamos el filtro de fechas a los embarques
          },
        },
        take: 5,
        orderBy: {
          boardings: {
            _count: 'desc', // Ordenamos por la cantidad de embarques
          },
        },
        include: {
          boardings: {
            where: dateFilter, // Aplicamos el filtro a los embarques
            select: {
              arrivalDate: true, // Seleccionamos solo la fecha de llegada
            },
          },
        },
      });

      const providersWithBoardingCount = providers.map((provider) => {
        const boardingCount = provider.boardings.length;
        const lastBoardingDate = boardingCount > 0 ? provider.boardings[boardingCount - 1].arrivalDate : null;

        return {
          id: provider.id,
          name: provider.name,
          boardingCount,
          lastBoardingDate,
        };
      });

      return Response.json(providersWithBoardingCount);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return Response.error();
  }
}
