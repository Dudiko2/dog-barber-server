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

            return res.status(201).json(appointment);
        } catch (e) {
            return res.status(500).json({ message: "Server Error" });
        }
    });

    router.put("/", async (req, res) => {
        try {
            const client = req.user as IClientDocument;
            const appointmentId: mongoose.Types.ObjectId = req.body.id;
            const data = getDataFromBody(req.body);

            if (!client.hasAppointment(appointmentId))
                return res.sendStatus(400);

            const appointment = await Appointment.findById(appointmentId);

            appointment.scheduled = data.scheduled || appointment.scheduled;
            await appointment.save();

            return res.status(200).json(appointment);
        } catch (e) {
            return res.status(400).json({ error: e.message });
        }
    });

    router.delete("/", async (req, res) => {
        try {
            const client = req.user as IClientDocument;
            const appointmentId: mongoose.Types.ObjectId = req.body.id;

            if (!client.hasAppointment(appointmentId))
                return res.sendStatus(400);

            client.appointments = client.appointments.filter(
                (a) => !a.equals(appointmentId)
            );

            const appointment = await Appointment.findById(appointmentId);

            await appointment.delete();
            await client.save();

            return res.status(200).json({ msg: "Appointment removed" });
        } catch (e) {
            return res.status(400).json({ error: e.message });
        }
    });

    return router;
};

export default appointmentsRoute;
