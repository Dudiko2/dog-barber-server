const isUnauth = (req: any, res: any, next: Function) => {
	console.log("isUnauth runs");
	if (!req.isAuthenticated()) return next();

	return res.status(400).json({ message: "400" });
};

export default isUnauth;
