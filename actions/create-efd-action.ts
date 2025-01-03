"use server"

import { prisma } from "@/src/lib/prisma";
import { AddEfdBoarding } from "@/src/schema";
import { CreateEfdType } from "@/src/types";
import { Prisma } from "@prisma/client";


export async function createBoardingEfd(info: CreateEfdType){
    const result = AddEfdBoarding.safeParse(info)

    if (!result.success) {
        return { errors: result.error.issues };
    }

    const efdData = {
        crateEfdDate: new Date(result.data.crateEfdDate), //lo combertimos a date
        boardingId: result.data.boardingId,
        invoiceNumber: result.data.invoiceNumber,
        supplierId: result.data.supplierId,
        ProblemTypeEfdId: result.data.ProblemTypeEfdId,
        buyerId: result.data.buyerId,
        material: result.data.material,
        quantityInvoiced: result.data.quantityInvoiced,
        quantityPhysical: result.data.quantityPhysical,
        quantityAsn: result.data.quantityAsn,
        asnNumber: result.data.asnNumber,
        responsible: result.data.responsible,
        description: result.data.description,
        image: result.data.image,
    }

    try {
        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            await tx.boardingEfd.create({
                data: efdData,
            })
        });
    } catch (error) {
        console.log("Error al crear el EFD", error)
    }
}