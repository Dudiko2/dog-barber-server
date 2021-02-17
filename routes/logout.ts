// /api/logout
import express from "express";
import isAuth from "../lib/isAuth";

const logoutRoute = () => {
	const router = express.Router();

	router.get("/", isAuth, (req, res) => {
		req.logout();
		res.json({ message: "Successfully logged out" });
	});

	return router;
};

export default logoutRoute;
