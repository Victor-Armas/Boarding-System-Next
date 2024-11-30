"use server"

import { prisma } from "@/src/lib/prisma"
import { BoardingSchema } from "@/src/schema"

export async function createBoarding(data: unknown){
    const result = BoardingSchema.safeParse(data)
    if(!result.success){
        return {
            errors: result.error.issues
        }
    }

    await prisma.boarding.create({
        data: result.data
    })
}