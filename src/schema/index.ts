import {z} from 'zod'

// Enum para los estados
export const BoardingStatus = z.enum([
    "PENDING_DOWNLOAD",
    "DOWNLOADING",
    "VALIDATING",
    "CAPTURING",
    "COMPLETED",
  ]);


export const BoardingSchema = z.object({
    numberBox: z.string()
        .trim()
        .min(1, { message: 'El numero de caja es Obligatorio'}),
    dateTime: z.string().datetime({message: 'Formato de Hora y Fecha Invalido'}),
    boxId: z.string()
        .trim()
        .transform((value) => parseInt(value)) 
        .refine((value) => value > 0, { message: 'El tipo de transporte es obligatorio' })
        .or(z.number().min(1, {message: 'El tipo de transporte es obligatorio' })),
    operator: z.string()
        .trim()
        .min(1, { message: 'El Operador es obligatorio'}),
    validator: z.string()
        .trim()
        .min(1, { message: 'El Validador es obligatorio'}),
    capturist: z.string()
        .trim()
        .min(1, { message: 'El Capturista es obligatorio'}),
    supplier: z.string()
        .trim()
        .min(1, { message: 'El Proveedor es obligatorio'}),
    pallets: z.string()
        .trim()
        .transform((value) => parseInt(value)) 
        .refine((value) => value > 0, { message: 'Las tarimas son obligatorias' })
        .or(z.number().min(1, {message: 'Las tarimas son obligatorias' })),
    comments: z.string()
        .trim()
        .min(1, { message: 'El Operador es obligatorio'}),
    perforations: z.boolean(),
    documentation: z.boolean(),
    security: z.boolean(),
    status: z.enum(["PENDING_DOWNLOAD", "DOWNLOADING", "VALIDATING", "CAPTURING", "COMPLETED"]).default("PENDING_DOWNLOAD"), // Valor por defecto
})

export type EditBoardingFormProps = z.infer<typeof BoardingSchema> & {boardingId: number;};