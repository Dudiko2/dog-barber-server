import express from "express";
import mongoose from "mongoose";

import isAuth from "../lib/isAuth";
import isUnauth from "../lib/isUnauth";
import { getDataFromBody } from "../db/db";

import { IClientDocument, IClientModel } from "../db/models/@types/client";

const clientsRoute = () => {
    const router = express.Router();
    const Client = mongoose.model<IClientDocument, IClientModel>("Client");

    // Delete that
    router.get("/", async (_req, res) => {
        try {
            const clients = await Client.find({});

            return res.json(clients);
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    });

    router.get("/me", isAuth, (req, res) => {
        return res.json(req.user);
    });

    router.post("/", isUnauth, async (req, res) => {
        try {
            const clientData = getDataFromBody(req.body);
            const client = new Client(clientData);
            await client.save();
            return req.login(client, (e) => {
                if (e) return res.status(500).json({ msg: "Error" });

                return res.status(201).json(req.user);
            });
        } catch (e) {
            return res.status(400).json({ error: e.message });
        }
    });

    router.put("/", isAuth, async (req, res) => {
        try {
            const newClientData = getDataFromBody(req.body);
            const client = req.user as IClientDocument;

            for (const key in newClientData) {
                client[key] = newClientData[key];
            }

            await client.save();
            return res.status(200).json(client);
        } catch (e) {
            return res.status(400).json({ error: e.message });
        }
    });

    router.delete("/", isAuth, async (req, res) => {
        try {
            const client = req.user as IClientDocument;

            await client.delete();
            return res.status(200).json({ msg: "Client removed" });
        } catch (e) {
            return res.status(400).json({ error: e.message });
        }
    });

    return router;
};

export default clientsRoute;
