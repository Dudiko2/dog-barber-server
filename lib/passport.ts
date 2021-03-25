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

				const verified = await clientReturned.verifyPassword(password);
				if (!verified) return done(null, false);

				return done(null, clientReturned);
			} catch (e) {
				return done(e);
			}
		})
	);

	passport.serializeUser((user: any, done) => {
		return done(null, user.username);
	});

	passport.deserializeUser(async (username: string, done) => {
		try {
			const client = await Client.getByUsername(username);
			return done(null, client);
		} catch (e) {
			return done(e);
		}
	});

	return passport;
};

export default getPassport;
