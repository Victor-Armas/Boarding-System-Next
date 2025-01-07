import { prisma } from "@/src/lib/prisma";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const type = url.searchParams.get("type"); // Extraer el parámetro 'type'

    try {
        if (type === "rampas") {
            const rampas = await prisma.ramp.findMany({
                orderBy: { id: "asc" },
            });
            return Response.json( rampas );
        }

        if (type === "validators") {
            const validators = await prisma.validator.findMany({
                orderBy: { id: "desc" },
            });
            return Response.json( validators );
        }

        if (type === "operator") {
            const forkliftOperator = await prisma.forkliftOperator.findMany({
                orderBy: { id: "desc" },
            });
            return Response.json( forkliftOperator );
        }

        if (type === "assistant") {
            const assistant = await prisma.assistant.findMany({
                orderBy: { id: "desc" },
            });
            return Response.json( assistant );
        }

    } catch (error) {
        console.error("Error al obtener los datos:", error);
        return Response.json(
            { error: "Error al obtener los datos" },
            { status: 500 }
        );
    }
}



export async function PATCH(request: Request) {
    try {
        const { action, rampaId, rampaAvailable,idValidator, isActive, nameValidator,idOperator,nameOperator,idAssistant, nameAssistant } = await request.json()

        if (action === 'updateAvailableRamp') {

            const updatedRamp = await prisma.ramp.update({
                where: { id: rampaId },
                data: {
                    available: rampaAvailable
                },
            });
            return Response.json(updatedRamp);
        }

        // ACCIONES PARA VALIDADOR 

        if (action === 'updateActiveValidator') {

            const updatedValidator = await prisma.validator.update({
                where: { id: idValidator },
                data: {
                    isActive: isActive
                },
            });
            return Response.json(updatedValidator);
        }

        if (action === 'updateValidator') {

            const updatedValidator = await prisma.validator.update({
                where: { id: idValidator },
                data: {
                    name: nameValidator
                },
            });
            return Response.json(updatedValidator);
        }

        // ACCIONES PARA OPERADOR

        if (action === 'updateActiveOperator') {

            const updatedOperator = await prisma.forkliftOperator.update({
                where: { id: idOperator },
                data: {
                    isActive: isActive
                },
            });
            return Response.json(updatedOperator);
        }

        if (action === 'updateOperator') {

            const updatedOperator = await prisma.forkliftOperator.update({
                where: { id: idOperator },
                data: {
                    name: nameOperator
                },
            });
            return Response.json(updatedOperator);
        }

        // ACCIONES PARA CAPTURISTA

        if (action === 'updateActiveAssistant') {

            const updatedAssistant = await prisma.assistant.update({
                where: { id: idAssistant},
                data: {
                    isActive: isActive
                },
            });
            return Response.json(updatedAssistant);
        }

        if (action === 'updateAssistant') {

            const updatedAssistant = await prisma.assistant.update({
                where: { id: idAssistant },
                data: {
                    name: nameAssistant
                },
            });
            return Response.json(updatedAssistant);
        }

        return Response.json({ error: 'Acción no válida' }, { status: 400 });
    }
    catch (error) {
        return Response.json({ error }, { status: 500 });
    }
}

export async function POST(request: Request){
    const { action, nameValidator, nameForkliftOperator, nameAssistant } = await request.json()

    try {
        if(action === 'createValidator'){

            if (!nameValidator) {
                return Response.json({ message: 'El nombre del validador es obligatorio.' }, { status: 400 });
            }
    
            const createValidator = await prisma.validator.create({
                data:{ name: nameValidator}
            })
    
            return Response.json(createValidator);
        }

        if(action === 'createForkliftOperator'){

            if (!nameForkliftOperator) {
                return Response.json({ message: 'El nombre del operador es obligatorio.' }, { status: 400 });
            }
    
            const createForkliftOperator= await prisma.forkliftOperator.create({
                data:{ name: nameForkliftOperator}
            })
    
            return Response.json(createForkliftOperator);
        }

        if(action === 'createAssistant'){

            if (!nameAssistant) {
                return Response.json({ message: 'El nombre del capturista es obligatorio.' }, { status: 400 });
            }
    
            const createAssistant= await prisma.assistant.create({
                data:{ name: nameAssistant}
            })
    
            return Response.json(createAssistant);
        }

        return Response.json({ error: 'Acción no válida' }, { status: 400 });
        
    } catch (error) {
        return Response.json({ error }, { status: 500 });
    }

}

export async function DELETE(request: Request){
    const {action, idValidator, idOperator, idAssistant} = await request.json()

    try {

        if(action === 'deleteValidator'){
            if(!idValidator){
                return Response.json({ message: 'El id del validador es obligatorio.' }, { status: 400 });
            }
    
            await prisma.validator.delete({
                where:{id: Number(idValidator)}
            })
            
            return Response.json({ message: "Almacenista eliminado con éxito" });
        }

        if(action === 'deleteOperator'){
            if(!idOperator){
                return Response.json({ message: 'El id del montacarguista es obligatorio.' }, { status: 400 });
            }
    
            await prisma.forkliftOperator.delete({
                where:{id: Number(idOperator)}
            })
            
            return Response.json({ message: "Montacarguista eliminado con éxito" });
        }

        if(action === 'deleteAssistant'){
            if(!idAssistant){
                return Response.json({ message: 'El id del capturista es obligatorio.' }, { status: 400 });
            }
    
            await prisma.assistant.delete({
                where:{id: Number(idAssistant)}
            })
            
            return Response.json({ message: "Capturista eliminado con éxito" });
        }
        
    } catch (error) {
        console.error("Error eliminando registro:", error);
        return Response.json({ error: "Error interno del servidor" }, { status: 500 });
    }

   
}