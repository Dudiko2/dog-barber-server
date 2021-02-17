import { Document, Types, Model } from "mongoose";

interface IAppointmentDocument extends Document {
	created: Date;
	scheduled: Date;
	client: Types.ObjectId;
}

interface IAppointmentModel extends Model<IAppointmentDocument> {}

export type { IAppointmentDocument, IAppointmentModel };
