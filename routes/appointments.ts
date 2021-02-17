// /api/appointments
import express from "express";
import mongoose from "mongoose";

import {
	IAppointmentDocument,
	IAppointmentModel,
} from "../db/models/@types/appointment";

const appointmentsRoute = () => {
	const router = express.Router();
	const Appointment = mongoose.model<IAppointmentDocument, IAppointmentModel>(
		"Appointment"
	);

	router.get("/", async (_req, res) => {
		const appointments = await Appointment.find({}).populate("client");

		res.json(appointments);
	});

	// router.post
	// router.put
	// router.delete

	return router;
};

export default appointmentsRoute;
