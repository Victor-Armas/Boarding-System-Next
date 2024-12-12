import { Assistant, Boarding, ForkliftOperator, Ramp, Supplier, Validator } from "@prisma/client";

export type BoardingDetails = Pick<Boarding,"id" | "boxNumber" | "rampId" | "forkliftOperatorId" >& {
  ramp?: Pick<Ramp, "id" | "nameRamp">; // Incluir solo los campos necesarios de la rampa
};
export type BoardingPendingRampId = Pick<Boarding,"id" | "forkliftOperatorId" | "boxNumber" | "arrivalDate" | "boxType" | "status" | "comments" |"rampId"
> & {
  supplier: Supplier; // Agrega los datos relacionados de la tabla Supplier
};
export type BoardingList = Pick<Boarding, "id"  | "boxNumber" | "arrivalDate" | "status" | "forkliftOperatorId" | "supplierId" | "validatorId" | "assistantId" | "pallets" | "comments" | "timeUntilRamp" | "downloadDuration" | "validationDuration" | "captureDuration" |"boxType"
> & {
  supplier: Supplier, // Agrega los datos relacionados de la tabla Supplier
  forkliftOperator: ForkliftOperator,
  validator: Validator,
  assistant: Assistant
};


export type BoardingGrouped = {
  ramp: BoardingPendingRampId[];
  downloading: BoardingPendingRampId[];
  validating: BoardingPendingRampId[];
  capturing: BoardingPendingRampId[];
  completed: BoardingPendingRampId[];
};

// ******** RAMP ********

export type AssignRamp = Pick<Ramp,"id" | "nameRamp">