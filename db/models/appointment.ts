import { model, Schema } from "mongoose";

import { IAppointmentDocument, IAppointmentModel } from "./@types/appointment";

const appointmentSchema = new Schema({
	created: {
		type: Date,
		required: true,
		immutable: true,
	},
	scheduled: {
		type: Date,
		required: true,
	},
	client: {
		type: Schema.Types.ObjectId,
		ref: "Client",
		required: true,
	},
});

const Appointment = model<IAppointmentDocument, IAppointmentModel>(
	"Appointment",
	appointmentSchema
);

export default Appointment;
