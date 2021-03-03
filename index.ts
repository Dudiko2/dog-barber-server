require("dotenv").config();
import express from "express";
import session from "express-session";
import connectMongo from "connect-mongo";
import mongoose from "mongoose";
import cors, { CorsOptions } from "cors";

import { connectDB } from "./db/db";
import getPassport from "./lib/passport";

import clientsRoute from "./routes/clients";
import appointmentsRoute from "./routes/appointments";
import loginRoute from "./routes/login";
import logoutRoute from "./routes/logout";

const port = process.env.PORT || "5000";

const MongoStore = connectMongo(session);

const corsConfig: CorsOptions = {
	origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
	credentials: true,
};

const runServer = async () => {
	await connectDB();

	const server = express();
	const passport = getPassport();

	server.disable("x-powered-by");

	server.use(cors(corsConfig));

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

	server.use("/clients", clientsRoute());
	server.use("/appointments", appointmentsRoute());
	server.use("/login", loginRoute(passport));
	server.use("/logout", logoutRoute());

	server.listen(port, () => {
		console.log(`> Running on ${port}`);
	});
};

runServer();
