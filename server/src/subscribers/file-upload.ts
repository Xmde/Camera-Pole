import { dir } from "console";
import moment from "moment-timezone";
import { DBPlateEntry } from "../database/models/PlateEntry";
import { db, globalEvent } from "../index"

export default () => {
    globalEvent.on('file-upload', async (data: string) => {
        console.log("event", data);
        const filePath = data.split('/');
        const fileName = filePath[filePath.length - 1];
        const cameraNumber = filePath[filePath.length - 2];

        console.log(fileName, cameraNumber)
        if (!(fileName && cameraNumber)) return;

        const imageData = fileName.split('_');
        console.log(imageData);
        if (imageData.length != 4 || imageData[3] != 'BACKGROUND.jpg') return;

        const direction = imageData[0];
        const time = imageData[1];
        const plate = imageData[2];

        const date = moment(
			time.slice(0, -3),
			'YYYYMMDDHHmmss'
		).utcOffset(8);

        console.log(plate, date);

        const PlateEntrySchema = db.load('plate-entry');
        const entry: DBPlateEntry = await PlateEntrySchema.create({
            plate,
            cameraNumber,
            direction,
            path: data,
            timestamp: date
        });
        entry.save();
    })
}