import { prisma } from "@/src/lib/prisma";
import { Boarding } from "@prisma/client";

export const dynamic = "force-dynamic"; // Fuerza el renderizado dinámico

export async function GET(request: Request) {
    try {

        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type");

        if (type === "ramps") {
            const ramps = await prisma.ramp.findMany({
                where: { isOccupied: false },
                select: { id: true, nameRamp: true },
                orderBy: { id: "asc" }
            });
            const forkliftOperators = await prisma.forkliftOperator.findMany({
                select: { id: true, name: true },
                orderBy: { name: "asc" } // Ordenar alfabéticamente por nombre
            });
            return Response.json({ ramps, forkliftOperators });
        }

        if (type === "downloadings") {

            const forkliftOperator = await prisma.forkliftOperator.findMany({
                select: { id: true, name: true },
                orderBy: { name: "asc" } // Ordenar alfabéticamente por nombre
            });
            return Response.json(forkliftOperator);

        }

        if (type === "validation") {

            const validator = await prisma.validator.findMany({
                select: { id: true, name: true },
                orderBy: { name: "asc" } // Ordenar alfabéticamente por nombre
            });
            return Response.json(validator);

        }

        if (type === "assistant") {

            const assistant = await prisma.assistant.findMany({
                select: { id: true, name: true },
                orderBy: { name: "asc" } // Ordenar alfabéticamente por nombre
            });
            return Response.json(assistant);

        }

        // Por defecto: devolver estados agrupados si no hay tipo
        const boardings: Boarding[] = await prisma.boarding.findMany({
            orderBy: {
                arrivalDate: "asc",
            },
            include: {
                ramp: true,
                supplier: true,
            },
        });

        const groupedBoardings = {
            ramp: boardings.filter((b) => b.rampId === null),
            downloading: boardings.filter((b) => b.status === "DOWNLOADING"),
            validating: boardings.filter((b) => b.status === "VALIDATING"),
            capturing: boardings.filter((b) => b.status === "CAPTURING"),
            completed: boardings.filter((b) => b.status === "COMPLETED"),
        };

        return Response.json(groupedBoardings);
    } catch (error) {
        console.log("Error en el servidor:", error);
        return Response.json({ error: "Error fetching data" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        // Obtener los datos del cuerpo de la solicitud
        const { action, boardingId, validatorId, downloadEndDate, validationStartDate, validationEndDate, rampId, forkliftOperatorId, downloadStartDate, pallets, assistantId, captureStartDate, captureEndDate, completedDate} = await request.json();

        // Validar que el action esté presente
        if (!action) {
            return new Response("Falta el parámetro 'action'", { status: 400 });
        }

        // Comprobar qué acción realizar según el valor de 'action'
        if (action === "assignRamp") {
            // Validaciones y lógica para asignar la rampa
            if (!boardingId || !rampId || !downloadStartDate) {
                return new Response("Faltan parámetros", { status: 400 });
            }

            // Obtener los datos del boarding, incluyendo arrivalDate
            const boarding = await prisma.boarding.findUnique({
                where: { id: boardingId },
                select: {
                    arrivalDate: true, // Fecha de llegada
                },
            });

            if (!boarding || !boarding.arrivalDate) {
                return new Response("Faltan datos de la fecha de llegada.", { status: 400 });
            }

            // Convertir arrivalDate y downloadStartDate a objetos Date
            const arrivalDate = new Date(boarding.arrivalDate);
            const downloadStartDateObj = new Date(downloadStartDate); // El valor ya debería ser un string en formato ISO-8601

            // Calcular la diferencia en milisegundos
            const differenceInMs = downloadStartDateObj.getTime() - arrivalDate.getTime();

            // Convertir la diferencia en minutos
            const timeUntilRamp = Math.floor(differenceInMs / (1000 * 60)); // Minutos

            // Asignar la rampa al boarding y cambiar su estado
            await prisma.boarding.update({
                where: { id: boardingId },
                data: {
                    rampId: rampId,
                    status: "DOWNLOADING", // Cambiar el estado del boarding
                    forkliftOperatorId: forkliftOperatorId,
                    downloadStartDate: downloadStartDate,
                    timeUntilRamp: timeUntilRamp, // Guardar el tiempo en minutos
                },
            });

            // Actualizar el estado de la rampa (marcarla como ocupada)
            await prisma.ramp.update({
                where: { id: rampId },
                data: { isOccupied: true },
            });

            return new Response("Rampa asignada exitosamente", { status: 200 });

        }

        else if (action === "assignDownloading") {
            // Obtener el boarding actual para verificar si ya tiene un montacarguista asignado
            const boarding = await prisma.boarding.findUnique({
                where: { id: boardingId },
                select: {
                    forkliftOperatorId: true,
                    downloadStartDate: true,
                },
            });
        
            if (!boarding) {
                return new Response("El embarque no existe.", { status: 404 });
            }
        
            // Validar el nuevo forkliftOperatorId solo si no hay uno asignado
            if (!boarding.forkliftOperatorId) {
                if (!forkliftOperatorId) {
                    return new Response("Falta asignar un montacarguista.", { status: 400 });
                }
            }
        
            // Validar otros parámetros necesarios
            if (!downloadEndDate || rampId === undefined) {
                return new Response("Parámetros faltantes o inválidos en 'assignDownloading'", { status: 400 });
            }
        
            // Convertir las fechas a objetos Date para validación y almacenamiento
            const downloadEndDateObj = new Date(downloadEndDate);
        
            if (!boarding.downloadStartDate) {
                return new Response("Faltan datos del inicio de la descarga.", { status: 400 });
            }
        
            const downloadStartDateObj = new Date(boarding.downloadStartDate);
        
            // Calcular la diferencia en minutos
            const durationInMs = downloadEndDateObj.getTime() - downloadStartDateObj.getTime();
            const downloadDuration = Math.floor(durationInMs / (1000 * 60)); // Diferencia en minutos
        
            // Actualizar el boarding con los datos del montacarguista y las fechas
            await prisma.boarding.update({
                where: { id: boardingId },
                data: {
                    forkliftOperatorId: boarding.forkliftOperatorId || forkliftOperatorId, // Usar el existente o el nuevo
                    downloadEndDate: downloadEndDateObj,
                    status: "VALIDATING", // Actualizar el estado del boarding
                    downloadDuration: downloadDuration,
                },
            });
        
            // Liberar la rampa
            await prisma.ramp.update({
                where: { id: rampId },
                data: { isOccupied: false },
            });
        
            return new Response("Montacarguista asignado exitosamente", { status: 200 });
        }
        

        else if (action === "validator"){
            if (!validationEndDate || !validationStartDate  || !validatorId || !pallets) {
                return new Response("Parámetros faltantes o inválidos en 'endValidator'", { status: 400 });
            }

            // Convertir las fechas a objetos Date para validación y almacenamiento
            const validationStartDateObj = new Date(validationStartDate);
            const validationEndDateObj = new Date(validationEndDate);

            // Calcular la diferencia en minutos
            const durationInMs = validationEndDateObj.getTime() - validationStartDateObj.getTime();
            const validationDuration = Math.floor(durationInMs / (1000 * 60)); // Diferencia en minutos

            await prisma.boarding.update({
                where: { id: boardingId },
                data: {
                    validationEndDate: validationEndDateObj,
                    validationStartDate: validationStartDateObj,
                    status: "CAPTURING", // Actualizar el estado del boarding
                    validatorId: validatorId,
                    validationDuration: validationDuration,
                    pallets: pallets
                },
            });

            return new Response("Finalizo la validación correctamente", { status: 200 });


        }

        else if (action === "completeBoarding"){
            if (!assistantId || !captureStartDate || !captureEndDate || !completedDate) {
                return new Response("Parámetros faltantes o inválidos en 'completeBoarding'", { status: 400 });
            }

            // Convertir las fechas a objetos Date para validación y almacenamiento
            const captureStartDateObj = new Date(captureStartDate);
            const captureEndDateObj = new Date(captureEndDate);
            const completedDateObj = new Date(completedDate);

            // Calcular la diferencia en minutos
            const durationInMs = captureEndDateObj.getTime() - captureStartDateObj.getTime();
            const captureDuration = Math.floor(durationInMs / (1000 * 60)); // Diferencia en minutos

            await prisma.boarding.update({
                where: { id: boardingId },
                data: {
                    captureStartDate: captureStartDateObj,
                    captureEndDate:captureEndDateObj,
                    status: "COMPLETED", // Actualizar el estado del boarding
                    captureDuration: captureDuration,
                    assistantId: assistantId,
                    completedDate: completedDateObj
                    
                },
            });

            return new Response("Embarque Finalizado Correctamente", { status: 200 });

        }

        else {
            return new Response("Acción no definida", { status: 400 });
        }

    } catch (error) {
        console.error("Error al procesar la solicitud:", error);
        return new Response("Error al procesar la solicitud", { status: 500 });
    }
}
