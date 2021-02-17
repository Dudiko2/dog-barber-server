const isAuth = (req: any, res: any, next: Function) => {
	console.log("isAuth runs");
	if (req.isAuthenticated()) return next();

	return res.status(401).json({ message: "401" });
};

export default isAuth;
