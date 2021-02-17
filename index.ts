require("dotenv").config();
import express from "express";
import session from "express-session";
import connectMongo from "connect-mongo";
import mongoose from "mongoose";

import { connectDB } from "./db/db";
import getPassport from "./lib/passport";

import clientsRoute from "./routes/clients";
import appointmentsRoute from "./routes/appointments";
import loginRoute from "./routes/login";
import logoutRoute from "./routes/logout";

const port = process.env.PORT || "5000";

const MongoStore = connectMongo(session);

const runServer = async () => {
	await connectDB();

	const server = express();
	const passport = getPassport();

	server.disable("x-powered-by");

	server.use(express.json());

	server.use(
		session({
			name: "barber-shop-ms.sid",
			secret: "hummus",
			cookie: { maxAge: 1000 * 3600 },
			resave: true,
			saveUninitialized: true,
			store: new MongoStore({ mongooseConnection: mongoose.connection }),
		})
	);
	server.use(passport.initialize());
	server.use(passport.session());

	server.use("/api/clients", clientsRoute());
	server.use("/api/appointments", appointmentsRoute());
	server.use("/api/login", loginRoute(passport));
	server.use("/api/logout", logoutRoute());

	server.listen(port, () => {
		console.log(`> Running on ${port}`);
	});
};

runServer();
