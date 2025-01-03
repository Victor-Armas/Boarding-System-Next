import { z } from 'zod'

// Enum para los estados
export const BoardingStatus = z.enum([
  "PENDING_DOWNLOAD",
  "DOWNLOADING",
  "VALIDATING",
  "CAPTURING",
  "COMPLETED",
]);

export const RampSchema = z.object({
  nameRamp: z.string().min(1, { message: 'El nombre de la rampa es obligatorio' }),
  isOccupied: z.boolean().default(false),
});


export const BoardingSchema = z.object({
  boxNumber: z.string()
    .min(1, { message: 'El numero de caja es Obligatorio' }),
  arrivalDate: z.date(),
  boxType: z.enum(["CAMIONETA", "TORTON", "MARITIMO", "CAJA_CERRADA", "FULL"]),
  forkliftOperatorId: z.number()
    .min(1, { message: 'El Operador es obligatorio' }),
  validatorId: z.number()
    .min(1, { message: 'El Validador es obligatorio' }),
  assistantId: z.number()
    .min(1, { message: 'El Capturista es obligatorio' }),
  rampId: z.number()
    .nullable(), // Permitir que sea null
  supplierId: z.number()
    .min(1, { message: 'El Proveedor es obligatorio' }),
  pallets: z.string()
    .transform((value) => parseInt(value))
    .refine((value) => value > 0, { message: 'Las tarimas son obligatorias' })
    .or(z.number().min(1, { message: 'Las tarimas son obligatorias' })),
  comments: z.string()
    .min(1, { message: 'El comentario es obligatorio' }),
  status: z.enum(["PENDING_DOWNLOAD", "DOWNLOADING", "VALIDATING", "CAPTURING", "COMPLETED"]).default("PENDING_DOWNLOAD"),
  downloadStartDate: z.date().nullable(), // Fecha opcional
  timeUntilRamp: z.number()
    .int()
    .nonnegative()
    .nullable(), // Permitir valores null o enteros >= 0
});

export const AddBoarding = BoardingSchema.pick({
  boxNumber: true,
  arrivalDate: true,
  boxType: true,
  supplierId: true,
  comments: true,
  rampId: true,
  status: true,
  downloadStartDate: true,
  timeUntilRamp: true
});

export const EdithBoarding = BoardingSchema.pick({
  boxNumber: true,
  arrivalDate: true,
  boxType: true,
  forkliftOperatorId: true,
  validatorId: true,
  assistantId: true,
  supplierId: true,
  comments: true,
  rampId: true,
  pallets: true,
});

export type Boarding = z.infer<typeof BoardingSchema>
export type EditBoardingFormProps = z.infer<typeof BoardingSchema> & { boardingId: number; };

// ******** USER *******

// Enum para los roles
const RoleEnum = z.enum(["ADMIN", "COORDINATOR", "ASSISTANT", "BUYER"], { message: "Asignacion de Rol obligatorio" });
// Enum para las tiendas
const StoreEnum = z.enum(["RYDER9", "PLANTG"], { message: "Asignacion de Planta obligatorio" });

export const UserSchema = z.object({
  name: z.string()
    .min(1, { message: "El nombre del usuario es obligatorio" }),
  email: z.string()
    .email({ message: "Debe ser un correo electrónico válido." })
    .min(1, { message: "El Email es obligatorio" })
    .transform((value) => value.toLowerCase()),
  password: z.string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres." })
    .max(128, { message: "La contraseña no puede exceder 128 caracteres." }),
  isVerified: z.boolean().default(false),
  createdAt: z.date().optional(), // Automáticamente generado por la base de datos
  updatedAt: z.date().optional(), // Automáticamente generado por la base de datos
  store: StoreEnum,
  role: RoleEnum,
})

export const LoginSchema = UserSchema.pick({
  email: true,
  password: true,
});



// Este es el tipo de TypeScript que se generará a partir del esquema `LoginSchema`.
export type UserLoginForm = Pick<z.infer<typeof UserSchema>, 'email' | 'password'>;




export const BoardingEfdSchema = z.object({
  id: z.number(), //agregue
  crateEfdDate: z.date(),
  boardingId: z.number().int().positive("El ID del embarque debe ser un número positivo"),
  invoiceNumber: z.string(),
  supplierId: z.number().int().positive("Debes de elegir un proveedor"),
  buyerId: z.number().int().positive("Debes de elegir un comprador"),
  ProblemTypeEfdId: z.number().int().positive("Debes de elegir un tipo de problema"),
  material: z.string().min(1, "El número del material es obligatorio"),
  quantityInvoiced: z.number(),
  quantityPhysical: z.number(),
  quantityAsn: z.number(),
  asnNumber: z.string(),
  responsible: z.enum(["RYDER", "CARRIER"], {
    message: "El responsable debe ser 'Ryder' o 'Carrier'",
  }),
  description: z.string().nullable().optional(), // Permitir nulo o undefined
  image: z.string().nullable().optional(), // Igual aquí
  status: z.enum(["PENDING", "IN_PROCESS", "COMPLETED"]), //Agregue
  daysElapsed: z.number().optional(), //Agregue
});

// Exporta el tipo inferido para usarlo en TypeScript
export type BoardingEfdType = z.infer<typeof BoardingEfdSchema>;

export const AddEfdBoarding = BoardingEfdSchema.pick({
  crateEfdDate: true,
  boardingId: true,
  invoiceNumber: true,
  supplierId: true,
  buyerId: true,
  ProblemTypeEfdId: true,
  material: true,
  quantityInvoiced: true,
  quantityPhysical: true,
  quantityAsn: true,
  asnNumber: true,
  responsible: true,
  description: true,
  image: true,
})

export const EditEfdBoarding = BoardingEfdSchema.pick({
  id: true,
  invoiceNumber: true,
  supplierId: true,
  buyerId: true,
  material: true,
  quantityInvoiced: true,
  quantityPhysical: true,
  quantityAsn: true,
  asnNumber: true,
  responsible: true,
  description: true,
})

export const UpdateStatusEfdSchema = BoardingEfdSchema.pick({
  id: true,
  status: true,
  daysElapsed: true
})


export type FormValues = z.infer<typeof EditEfdBoarding>;