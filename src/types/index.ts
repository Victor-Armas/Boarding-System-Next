import { Assistant, Boarding, BoardingEfd, BoardingIssue, ForkliftOperator, Prisma, ProblemType, ProblemTypeEfd, Ramp, Supplier, User, Validator } from "@prisma/client";

export type BoardingDetails = Pick<Boarding,"id" | "boxNumber" | "rampId" | "forkliftOperatorId" >& {
  ramp?: Pick<Ramp, "id" | "nameRamp">; // Incluir solo los campos necesarios de la rampa
};
export type BoardingPendingRampId = Pick<Boarding,"id" | "forkliftOperatorId" | "boxNumber" | "arrivalDate" | "boxType" | "status" | "comments" |"rampId" | "hasIssues"
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
export type BoardingEdithType = Pick<Boarding, "id" | "boxNumber" | "arrivalDate" | "status" | "forkliftOperatorId" | "supplierId" | "validatorId" | "assistantId" | "pallets" | "comments" | "timeUntilRamp" | "downloadDuration" | "validationDuration" | "captureDuration" | "boxType" | "rampId"> & {
  supplier: Supplier | null;
  forkliftOperator: ForkliftOperator | null;
  validator: Validator | null;
  assistant: Assistant | null;
  ramp: Ramp | null;
};

export type CreateBoardingType = Pick<Boarding, "boxNumber" |  "arrivalDate" | "boxType" |"supplierId" | "rampId" | "comments" | "status" | "downloadStartDate" | "timeUntilRamp"> 

export type BoardingGrouped = {
  ramp: BoardingPendingRampId[];
  downloading: BoardingPendingRampId[];
  validating: BoardingPendingRampId[];
  capturing: BoardingPendingRampId[];
  completed: BoardingPendingRampId[];
};

// ******** RAMP ********

export type AssignRamp = Pick<Ramp,"id" | "nameRamp">

// ******** Usuario ********

export type UserAuth = Pick<User, "id" | "role" | "isActive"| "name"> & {
  userId: number;  // Agregamos la propiedad userId
};
export type CreateUserType = Pick<User, "name"|"email"|"password"|"store"|"role">

//********* LIST ******* */
export type BoardingWhereInput = Pick<Prisma.BoardingWhereInput, "boxNumber" | "arrivalDate" | "supplier" | "status">;

const BoardingStatus = {
  PENDING_DOWNLOAD: "PENDING_DOWNLOAD",
  DOWNLOADING: "DOWNLOADING",
  VALIDATING: "VALIDATING",
  CAPTURING: "CAPTURING",
  COMPLETED: "COMPLETED",
} as const;

export type BoardingStatus = (typeof BoardingStatus)[keyof typeof BoardingStatus];

//********* Problemas ******* */

export type ProblemBoardingList = Pick<BoardingIssue,"boardingId"|"createdAt"|"description"|"id"|"problemTypeId"|"resolved"|"state" 
> &{
  problemType : ProblemType
}

export type BannerProblems = BoardingIssue & {
  boarding : Boarding
}

//********* EFD'S ******* */

export type CreateEfdType = Pick<BoardingEfd, "asnNumber"|"boardingId"|"buyerId"|"crateEfdDate"|"invoiceNumber"|"material"|"quantityAsn"|"quantityInvoiced"|"quantityPhysical"|"responsible"|"supplierId">

export type RawEfdType = Pick<BoardingEfd, "id" | "crateEfdDate" | "daysElapsed" | "status"> & {
  boarding?: Boarding | null; // Si la relación puede ser null
};
export type CardsEfdType = BoardingEfd & {
  boarding : Boarding
  ProblemTypeEfd : ProblemTypeEfd
}

export type DetailsCardsEfdType = BoardingEfd & {
  ProblemTypeEfd : ProblemTypeEfd
}

export type BoardingEFDWhereInput = Pick<Prisma.BoardingEfdWhereInput,  "crateEfdDate" | "supplier" | "status">;
