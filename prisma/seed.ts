import { boxs } from "./data/boxs";
import { boardings } from "./data/boarding";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function main(){
    try {
        await prisma.box.createMany({
            data: boxs
        })
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