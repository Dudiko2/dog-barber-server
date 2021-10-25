import express from "express";
import { PassportStatic } from "passport";

const loginRoute = (passport: PassportStatic) => {
	const router = express.Router();

	router.post(
		"/",
		passport.authenticate("local", {
			session: true,
		}),
		(req, res) => {
			return res.json(req.user);
		}
	);

	return router;
};

export default loginRoute;
