import { BoardingStatus, CajaType } from '@prisma/client';

export const boardings = [
  // 5 con el estatus PENDING_DOWNLOAD
  { boxNumber: 'A1230', arrivalDate: new Date('2024-12-01T09:00:00.000Z'), supplierId:13, boxType: CajaType.CAMIONETA, status: BoardingStatus.PENDING_DOWNLOAD, comments: 'Caja en espera', rampId: null },
  { boxNumber: 'A1231', arrivalDate: new Date('2024-12-02T09:05:00.000Z'), supplierId:13,  boxType: CajaType.CAMIONETA, status: BoardingStatus.PENDING_DOWNLOAD, comments: 'Caja en espera', rampId: null },
  { boxNumber: 'A1232', arrivalDate: new Date('2024-12-03T09:10:00.000Z'), supplierId:13,  boxType: CajaType.CAMIONETA, status: BoardingStatus.PENDING_DOWNLOAD, comments: 'Caja en espera', rampId: null },
  { boxNumber: 'A1233', arrivalDate: new Date('2024-12-04T09:15:00.000Z'), supplierId:13,  boxType: CajaType.CAMIONETA, status: BoardingStatus.PENDING_DOWNLOAD, comments: 'Caja en espera', rampId: null },
  { boxNumber: 'A1234', arrivalDate: new Date('2024-12-05T09:20:00.000Z'), supplierId:13,  boxType: CajaType.CAMIONETA, status: BoardingStatus.PENDING_DOWNLOAD, comments: 'Caja en espera', rampId: null },

  // 5 con el estatus DOWNLOADING
  { boxNumber: 'B1230', arrivalDate: new Date('2024-12-01T10:00:00.000Z'), supplierId:13, boxType: CajaType.CAMIONETA, status: BoardingStatus.DOWNLOADING, comments: 'En proceso de descarga', rampId: 1 },
  { boxNumber: 'B1231', arrivalDate: new Date('2024-12-02T10:05:00.000Z'), supplierId:13, boxType: CajaType.CAMIONETA, status: BoardingStatus.DOWNLOADING, comments: 'En proceso de descarga', rampId: 2 },
  { boxNumber: 'B1232', arrivalDate: new Date('2024-12-03T10:10:00.000Z'), supplierId:13, boxType: CajaType.CAMIONETA, status: BoardingStatus.DOWNLOADING, comments: 'En proceso de descarga', rampId: 3 },
  { boxNumber: 'B1233', arrivalDate: new Date('2024-12-04T10:15:00.000Z'), supplierId:13, boxType: CajaType.CAMIONETA, status: BoardingStatus.DOWNLOADING, comments: 'En proceso de descarga', rampId: 4 },
  { boxNumber: 'B1234', arrivalDate: new Date('2024-12-05T10:20:00.000Z'), supplierId: 13, boxType: CajaType.CAMIONETA, status: BoardingStatus.DOWNLOADING, comments: 'En proceso de descarga', rampId: 5 },

  // 5 con el estatus VALIDATING
  { boxNumber: 'C1230', arrivalDate: new Date('2024-12-01T11:00:00.000Z'), supplierId: 13, boxType: CajaType.CAMIONETA, status: BoardingStatus.VALIDATING, comments: 'En validación', rampId: 1 },
  { boxNumber: 'C1231', arrivalDate: new Date('2024-12-02T11:05:00.000Z'), supplierId: 13, boxType: CajaType.CAMIONETA, status: BoardingStatus.VALIDATING, comments: 'En validación', rampId: 2 },
  { boxNumber: 'C1232', arrivalDate: new Date('2024-12-03T11:10:00.000Z'), supplierId: 13, boxType: CajaType.CAMIONETA, status: BoardingStatus.VALIDATING, comments: 'En validación', rampId: 3 },
  { boxNumber: 'C1233', arrivalDate: new Date('2024-12-04T11:15:00.000Z'), supplierId: 13, boxType: CajaType.CAMIONETA, status: BoardingStatus.VALIDATING, comments: 'En validación', rampId: 4 },
  { boxNumber: 'C1234', arrivalDate: new Date('2024-12-05T11:20:00.000Z'), supplierId: 13, boxType: CajaType.CAMIONETA, status: BoardingStatus.VALIDATING, comments: 'En validación', rampId: 5 },

  // 5 con el estatus CAPTURING
  { boxNumber: 'D1230', arrivalDate: new Date('2024-12-01T12:00:00.000Z'), supplierId: 13, boxType: CajaType.CAMIONETA, status: BoardingStatus.CAPTURING, comments: 'En captura', rampId: 1 },
  { boxNumber: 'D1231', arrivalDate: new Date('2024-12-02T12:05:00.000Z'), supplierId: 13, boxType: CajaType.CAMIONETA, status: BoardingStatus.CAPTURING, comments: 'En captura', rampId: 2 },
  { boxNumber: 'D1232', arrivalDate: new Date('2024-12-03T12:10:00.000Z'), supplierId: 13, boxType: CajaType.CAMIONETA, status: BoardingStatus.CAPTURING, comments: 'En captura', rampId: 3 },
  { boxNumber: 'D1233', arrivalDate: new Date('2024-12-04T12:15:00.000Z'), supplierId: 13, boxType: CajaType.CAMIONETA, status: BoardingStatus.CAPTURING, comments: 'En captura', rampId: 4 },
  { boxNumber: 'D1234', arrivalDate: new Date('2024-12-05T12:20:00.000Z'), supplierId: 13, boxType: CajaType.CAMIONETA, status: BoardingStatus.CAPTURING, comments: 'En captura', rampId: 5 },

  // 5 con el estatus COMPLETED
  { boxNumber: 'E1230', arrivalDate: new Date('2024-12-01T13:00:00.000Z'), supplierId: 13, boxType: CajaType.CAMIONETA, status: BoardingStatus.COMPLETED, comments: 'Completado', rampId: 1 },
  { boxNumber: 'E1231', arrivalDate: new Date('2024-12-02T13:05:00.000Z'), supplierId: 13, boxType: CajaType.CAMIONETA, status: BoardingStatus.COMPLETED, comments: 'Completado', rampId: 2 },
  { boxNumber: 'E1232', arrivalDate: new Date('2024-12-03T13:10:00.000Z'), supplierId: 13, boxType: CajaType.CAMIONETA, status: BoardingStatus.COMPLETED, comments: 'Completado', rampId: 3 },
  { boxNumber: 'E1233', arrivalDate: new Date('2024-12-04T13:15:00.000Z'), supplierId: 13, boxType: CajaType.CAMIONETA, status: BoardingStatus.COMPLETED, comments: 'Completado', rampId: 4 },
  { boxNumber: 'E1234', arrivalDate: new Date('2024-12-05T13:20:00.000Z'), supplierId: 13, boxType: CajaType.CAMIONETA, status: BoardingStatus.COMPLETED, comments: 'Completado', rampId: 5 }
]

