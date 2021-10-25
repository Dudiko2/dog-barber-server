import { Document, Types, Model } from "mongoose";

interface IClientDocument extends Document {
	fname: string;
	username: string;
	password: string;
	appointments: Types.ObjectId[];
	hasAppointment: (id: Types.ObjectId) => boolean;
}

interface IClientModel extends Model<IClientDocument> {
	getByUsername: (username: string) => any;
}

export type { IClientDocument, IClientModel };
