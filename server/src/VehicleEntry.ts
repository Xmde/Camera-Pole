import { db } from "./index";
import { DBPlateEntry } from "./database/models/PlateEntry";

export class VehicleEntry {

    private static vehicleEntries: Map<string, VehicleEntry> = new Map();


    private entries: DBPlateEntry[];
    private plate: string;
    private timeout: NodeJS.Timeout;
    private timestamp: Date;
    private directionAbs: 'NORTH' | 'SOUTH';

    public static addPlateEntry(entry: DBPlateEntry) {
        if (entry.plate === 'unknown') {
            this.addVehicleEntrySingle(entry);
            return;
        }
        const plate = entry.plate;
        if (!this.vehicleEntries.has(plate)) this.vehicleEntries.set(plate, new VehicleEntry(plate, entry.timestamp, entry.directionAbsolute));
        this.vehicleEntries.get(plate)!.addEntry(entry);
    }

    public static async addVehicleEntrySingle(entry: DBPlateEntry) {
        const VehicleEntrySchema = db.load('vehicle-entry');

        const dbEntry = await VehicleEntrySchema.create({
            timestamp: entry.timestamp,
            plate: entry.plate,
            entries: [entry]
        });

        dbEntry.save();
    }

    private constructor(plate: string, timestamp: Date, dirAbs: 'NORTH' | 'SOUTH') {
        this.entries = [];
        this.plate = plate;
        this.timeout = setTimeout(this.save, 1000 * 60 * 10);
        this.timestamp = timestamp;
        this.directionAbs = dirAbs;
    }

    private addEntry(entry: DBPlateEntry) {
        if (this.directionAbs !== entry.directionAbsolute) {
            this.save();
            VehicleEntry.addPlateEntry(entry);
        }
        this.entries.push(entry);
        this.timeout.refresh();
    }

    private async save() {
        clearTimeout(this.timeout);
        VehicleEntry.vehicleEntries.delete(this.plate);

        const VehicleEntrySchema = db.load('vehicle-entry');

        const entry = await VehicleEntrySchema.create({
            timestamp: this.timestamp,
            plate: this.plate,
            entries: this.entries
        });

        entry.save();
    }
}