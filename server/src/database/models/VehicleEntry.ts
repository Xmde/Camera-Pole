/**
 * Error Schema used for storing error logs in the database
 */

 import { Document, model, Schema } from 'mongoose';
import { DBPlateEntry } from './PlateEntry';

 /**
  * Error interface used for storing error logs in the database
  */
 export interface DBVehicleEntry extends Document {
     timestamp: Date;
     plate: string;
     entries: DBPlateEntry[];
 }
 
 /**
  * Error schema used for storing error logs in the database
  */
 const PlateEntrySchema = new Schema<DBVehicleEntry>({
     timestamp: { type: Schema.Types.Date, default: new Date(Date.now()) },
     plate: {type: Schema.Types.String, required: true},
     entries: {type: [Schema.Types.Mixed], required: true}
 });
 
 export const Model = model<DBPlateEntry>('vehicle-entry', PlateEntrySchema);
 export const name: string = 'vehicle-entry';