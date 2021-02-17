import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import mongoose from "mongoose";

import { IClientDocument, IClientModel } from "../db/models/@types/client";

const getPassport = () => {
	const Client = mongoose.model<IClientDocument, IClientModel>("Client");

	passport.use(
		new LocalStrategy(async (username, password, done) => {
			try {
				const clientReturned = await Client.getByUsername(username);

				if (!clientReturned) return done(null, false);
				if (!clientReturned.verifyPassword(password)) return done(null, false);

				return done(null, clientReturned);
			} catch (e) {
				return done(e);
			}
		})
	);

	passport.serializeUser((user: any, done) => {
		console.log("serialize");
		return done(null, user.username);
	});

	passport.deserializeUser(async (username: string, done) => {
		try {
			const client = await Client.getByUsername(username);
			console.log(`deserialize`);
			return done(null, client);
		} catch (e) {
			return done(e);
		}
	});

	return passport;
};

export default getPassport;
