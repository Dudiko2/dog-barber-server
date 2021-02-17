// /api/clients
import express from "express";
import mongoose from "mongoose";

import isAuth from "../lib/isAuth";

import { IClientDocument, IClientModel } from "../db/models/@types/client";

const clientsRoute = () => {
	const router = express.Router();
	const Client = mongoose.model<IClientDocument, IClientModel>("Client");

	router.get("/", async (_req, res) => {
		try {
			const clients = await Client.find({});

			return res.json(clients);
		} catch (e) {
			return res.status(500).json({ error: e.message });
		}
	});

	router.get("/me", isAuth, (req, res) => {
		console.log(req.session);
		console.log(req.sessionID);

		return res.json(req.user);
	});

	router.post("/", async (req, res) => {
		try {
			const client = new Client(req.body);
			await client.save();

			return res.json(client);
		} catch (e) {
			return res.status(400).json({ error: e.message });
		}
	});

	return router;
};

export default clientsRoute;
