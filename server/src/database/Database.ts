import mongoose, { Model } from 'mongoose';
import glob from 'glob';
import { promisify } from 'util';

const globPromise = promisify(glob);

/**
 * Class for Database handeling
 * Logins to the database and get Models
 * Each model is defined in a seperate .ts file
 * Models are in the models folder
 * This auto imports models and sets them up.
 */
class Database {
	private models: Map<string, Model<any>> = new Map();
	public constructor(mongoURI: string) {
		mongoose.connect(mongoURI);
	}

	/**
	 * Loads all models in the models folder
	 */
	public async init(): Promise<void> {
		const modelFiles = await globPromise(`${__dirname}/models/*{.ts,.js}`);
		modelFiles.forEach(async (value: string) => {
			const model = await import(value);
			this.models.set(model.name, model.Model);
		});
	}

	/**
	 *
	 * @param name The name of the model
	 * @returns {Model<any>} The model
	 */
	public load(name: string): Model<any> {
        if (!this.models.has(name)) console.error("NO MODEL EXISTS!");
		return this.models.get(name)!;
	}
}

export { Database };
