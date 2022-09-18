import moment from "moment-timezone";
import { DBPlateEntry } from "../database/models/PlateEntry";
import { db, globalEvent } from "../index"
import { VehicleEntry } from "../VehicleEntry";

function isNumber(val: any): val is number {
    return !Number.isNaN(val);
}

export default () => {
    globalEvent.on('file-upload', async (data: string) => {
        console.log("event", data);
        const filePath = data.split('/');
        const fileName = filePath[filePath.length - 1];
        const cameraNumber = filePath[filePath.length - 2];
        if (!isNumber(cameraNumber)) return;

        console.log(fileName, cameraNumber)
        if (!(fileName && cameraNumber)) return;

        const imageData = fileName.split('_');
        console.log(imageData);
        if (imageData.length != 4 || imageData[3] != 'BACKGROUND.jpg') return;

        const direction = imageData[0];
        const directionAbsolute = ((direction === "FORWARD") && (cameraNumber % 2 === 0) || (direction === "REVERSE") && (cameraNumber % 2 !== 0)) ? "NORTH" : "SOUTH";
        const time = imageData[1];
        const plate = imageData[2];

        const date = moment(
			time.slice(0, -3),
			'YYYYMMDDHHmmss'
		).add(8, 'hours');

        console.log(plate, date);

        const PlateEntrySchema = db.load('plate-entry');
        const entry: DBPlateEntry = await PlateEntrySchema.create({
            plate,
            cameraNumber,
            direction,
            directionAbsolute,
            path: data,
            timestamp: date
        });
        entry.save();

        VehicleEntry.addPlateEntry(entry);
    })
}
