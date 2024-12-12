import { boxs } from "./data/boxs";
import { PrismaClient } from "@prisma/client";
import { ramp } from "./data/ramp";
import { boardings } from "./data/boarding";

const prisma = new PrismaClient()

async function main(){
    try {
        // await prisma.box.createMany({
        //     data: boxs
        // })
        // await prisma.ramp.createMany({
        //     data: ramp
        // })
        await prisma.boarding.createMany({
            data: boardings
        })
    } catch (error) {
        console.log(error)
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch( async(e) => {
        console.log(e)
        await prisma.$disconnect()
        process.exit(1)
    })