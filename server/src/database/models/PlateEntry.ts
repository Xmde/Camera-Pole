/**
 * Error Schema used for storing error logs in the database
 */

 import { Document, model, Schema } from 'mongoose';

 /**
  * Error interface used for storing error logs in the database
  */
 export interface DBPlateEntry extends Document {
     timestamp: Date;
     direction: string;
     dirAbsolute: 'NORTH' | 'SOUTH';
     plate: string;
     cameraNumber: number;
     path: string;
 }
 
 /**
  * Error schema used for storing error logs in the database
  */
 const PlateEntrySchema = new Schema<DBPlateEntry>({
     timestamp: { type: Schema.Types.Date, default: new Date(Date.now()) },
     direction: {type: Schema.Types.String, required: true},
     dirAbsolute: {type: Schema.Types.String, required: true},
     plate: {type: Schema.Types.String, required: true},
     cameraNumber: { type: Schema.Types.Number, required: true },
     path: {type: Schema.Types.String, required: true}
 });
 
 export const Model = model<DBPlateEntry>('plate-entry', PlateEntrySchema);
 export const name: string = 'plate-entry';