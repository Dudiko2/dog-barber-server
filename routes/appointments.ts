import express from "express";
import mongoose from "mongoose";

import isAuth from "../lib/isAuth";
import { getDataFromBody } from "../db/db";

import {
	IAppointmentDocument,
	IAppointmentModel,
} from "../db/models/@types/appointment";
import { IClientDocument } from "../db/models/@types/client";

const appointmentsRoute = () => {
	const router = express.Router();
	const Appointment = mongoose.model<IAppointmentDocument, IAppointmentModel>(
		"Appointment"
	);

	router.use(isAuth);

	router.get("/", async (_req, res) => {
		try {
			const appointments = await Appointment.find({}).populate("client");

			return res.json(appointments);
		} catch (e) {
			return res.status(500).json({ message: "Server Error" });
		}
	});

	router.post("/", async (req, res) => {
		try {
			const client = req.user as IClientDocument;
			const clientId = client._id;

			const appointmentData = getDataFromBody(req.body);
			const appointment = new Appointment({
				...appointmentData,
				client: clientId,
			});
			const appointmentId = appointment._id;

			client.appointments.push(appointmentId);

			await appointment.save();
			await client.save();

			return res.status(201).json({ success: "yay" });
		} catch (e) {
			console.log(e);
			return res.status(500).json({ message: "Server Error" });
		}
	});
	// router.put
	// router.delete

	return router;
};

export default appointmentsRoute;
